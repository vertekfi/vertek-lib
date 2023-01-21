import { Contract, ContractReceipt, ethers } from 'ethers';
import { defaultAbiCoder, getAddress, parseUnits } from 'ethers/lib/utils';
import * as fs from 'fs-extra';
import { join } from 'path';
import {
  PoolTokenInfo,
  PoolCreationConfig,
  CreateWeightedPoolArgs,
  StablePoolCreationArgs,
  JoinPoolRequest,
} from 'src/types/pool.types';
import { CHAIN_KEYS, getChainId, getSigner } from 'src/utils/account.util';
import { getVault } from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';

/**
 * Sorts the tokens for a pool according to address as required by the vault.
 * Having the initial balance to be used for liquidity, and the weights attached(if applicable),
 * allows for all required info to be "index aligned".
 * Would have a busted pool if these items do not line up with their associated token.
 * @param tokens
 * @returns
 */
export function sortTokensWithInfo(tokens: PoolTokenInfo[]): PoolTokenInfo[] {
  return tokens.sort((t1, t2) =>
    getAddress(t1.address) < getAddress(t2.address) ? -1 : 1,
  );
}

export function getWeightedPoolArgsFromConfig(
  pool: PoolCreationConfig,
  owner: string,
): CreateWeightedPoolArgs {
  pool.deploymentArgs.rateProviders = pool.deploymentArgs.rateProviders?.length
    ? pool.deploymentArgs.rateProviders
    : pool.deploymentArgs.tokens.map((t) => ethers.constants.AddressZero);

  const sortedInfo = sortTokensWithInfo(pool.tokenInfo);

  return {
    name: pool.deploymentArgs.name,
    symbol: pool.deploymentArgs.symbol,
    tokens: sortedInfo.map((info) => info.address),
    swapFeePercentage: pool.deploymentArgs.swapFeePercentage,
    owner,
    rateProviders: pool.deploymentArgs.rateProviders,
    weights: sortedInfo.map((info) => info.weight),
    initialBalances: sortedInfo.map((info) => info.initialBalance),
  };
}

export function getStablePoolCreationArgs(
  pool: PoolCreationConfig,
): StablePoolCreationArgs {
  const sortedInfo = sortTokensWithInfo(pool.tokenInfo);

  return {
    name: pool.deploymentArgs.name,
    symbol: pool.deploymentArgs.symbol,
    tokens: sortedInfo.map((info) => info.address),
    swapFeePercentage: pool.deploymentArgs.swapFeePercentage,
    owner: pool.deploymentArgs.owner,
    amplificationParameter: pool.amp,
    initialBalances: sortedInfo.map((info) => info.initialBalance),
  };
}

export async function getPoolConfigPath() {
  return join(
    process.cwd(),
    'src/data',
    `${CHAIN_KEYS[await getChainId()]}-pools.json`,
  );
}

export async function getAllPoolConfigs(): Promise<PoolCreationConfig[]> {
  return await fs.readJSON(await getPoolConfigPath());
}

export async function getMainPoolConfig() {
  const poolConfigs = await getAllPoolConfigs();
  return poolConfigs.find((p) => p.isVePool);
}

export async function updatePoolConfig(pool: PoolCreationConfig) {
  logger.info(`updatePoolConfig: updating ${pool.name}`);
  const poolConfigs = await getAllPoolConfigs();
  let updating = poolConfigs.find((p) => p.name === pool.name);
  updating = {
    ...updating,
    ...pool,
  };
  await savePoolsData(poolConfigs);

  logger.success(`updatePoolConfig: pool update complete`);
}

export async function savePoolsData(pools: PoolCreationConfig[]) {
  await fs.writeJSON(await getPoolConfigPath(), pools);
}

export async function getPoolId(poolAddress: string) {
  const pool = new Contract(
    poolAddress,
    ['function getPoolId() public view returns (bytes32)'],
    await getSigner(),
  );

  return pool.getPoolId();
}

export async function getPoolCreationData(poolAddress: string) {
  try {
    const pool = new Contract(
      poolAddress,
      ['function getPoolId() public view returns (bytes32)'],
      await getSigner(),
    );

    const data = {
      poolId: await pool.getPoolId(),
      poolAddress,
      // txHash: receipt.transactionHash,
      date: new Date().toLocaleString(),
    };

    console.log(data);

    return data;
  } catch (error) {
    logger.error(`getPoolCreationData:`, error);
    return null;
  }
}

/**
 * Utility to perform the INIT_JOIN operation on a weight pool.
 * Will approve the vault for each token as needed.
 * @param poolId
 * @param tokens
 * @param initialBalances
 * @param recipient
 * @returns
 */
export async function initWeightedJoin(
  poolId: string,
  tokens: string[],
  initialBalances: string[],
  recipient: string,
): Promise<ContractReceipt> {
  try {
    logger.info('Starting INIT_JOIN for pool id: ' + poolId);

    const JOIN_KIND_INIT = 0; // Can only be called once for most pools

    // convert to BigNumber before encoding
    const balancesBN = initialBalances.map((a) => parseUnits(a));

    // Must be encoded
    const initUserData = defaultAbiCoder.encode(
      ['uint256', 'uint256[]'],
      [JOIN_KIND_INIT, balancesBN],
    );

    const joinPoolRequest: JoinPoolRequest = {
      assets: tokens,
      maxAmountsIn: balancesBN,
      userData: initUserData,
      fromInternalBalance: false,
    };

    const vault = await getVault();

    // Vault needs approval to pull the tokens in
    // await approveTokensIfNeeded(tokens, recipient, vault.address);

    const rx = await awaitTransactionComplete(
      await vault.joinPool(poolId, recipient, recipient, joinPoolRequest),
    );

    logger.success('INIT_JOIN complete');

    console.log(rx);

    return rx;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
