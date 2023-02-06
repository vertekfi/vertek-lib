import { Contract, ContractReceipt, ethers } from 'ethers';
import { defaultAbiCoder, getAddress, parseUnits } from 'ethers/lib/utils';
import * as fs from 'fs-extra';
import { join } from 'path';
import { TOKENS } from 'src/data/token';
import { calcOutGivenIn } from 'src/math';
import {
  PoolTokenInfo,
  PoolCreationConfig,
  CreateWeightedPoolArgs,
  StablePoolCreationArgs,
  JoinPoolRequest,
  PoolType,
  WeightedTokenInfo,
  JoinKind,
} from 'src/types/pool.types';
import { ProtocolPoolDataConfig } from 'src/types/protocol.types';
import { _require } from 'src/utils';
import { CHAIN_KEYS, getChainId, getSigner } from 'src/utils/account.util';
import {
  getLiquidityGaugeInstance,
  getTimelockAuthorizer,
  getVault,
  getWeightedPoolToken,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { getSighash, grantVaultAuthorizerPermissions } from '../auth/auth';

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
    t1.address.toLowerCase() < t2.address.toLowerCase() ? -1 : 1,
  );
}

export function getWeightedPoolArgsFromConfig(
  pool: PoolCreationConfig,
  owner: string,
): CreateWeightedPoolArgs {
  pool.deploymentArgs.rateProviders = pool.deploymentArgs.rateProviders?.length
    ? pool.deploymentArgs.rateProviders
    : pool.tokenInfo.map((t) => ethers.constants.AddressZero);

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
    'src/data/vertek',
    `${CHAIN_KEYS[await getChainId()]}-pools.json`,
  );
}

export function getDexPoolDataConfigPath() {
  return join(process.cwd(), 'src/data/vertek/pool-data-config.json');
}

export async function getDexPoolDataConfig(): Promise<ProtocolPoolDataConfig> {
  const data = await fs.readJSON(getDexPoolDataConfigPath());
  return data[String(await getChainId())];
}

export async function updateDexPoolDataConfig(data) {
  await fs.writeJSON(getDexPoolDataConfigPath(), data);
}

export async function getAllPoolConfigs(): Promise<PoolCreationConfig[]> {
  return await fs.readJSON(await getPoolConfigPath());
}

export async function getMainPoolConfig() {
  const poolConfigs = await getAllPoolConfigs();
  return poolConfigs.find((p) => p.isVePool);
}

export async function getPoolConfig(index: number) {
  const poolConfigs = await getAllPoolConfigs();
  return poolConfigs[index];
}

export async function updatePoolConfig(pool: PoolCreationConfig) {
  logger.info(`updatePoolConfig: updating "${pool.name}"`);
  const poolConfigs = await getAllPoolConfigs();

  let updating = poolConfigs.find((p) => p.name === pool.name);
  const idx = poolConfigs.indexOf(updating);
  updating = {
    ...updating,
    ...pool,
  };

  poolConfigs[idx] = updating;
  await savePoolsData(poolConfigs);

  logger.success(`updatePoolConfig: pool update complete`);

  return updating;
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
    const data = {
      poolId: await getPoolId(poolAddress),
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
) {
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
      assets: tokens.map((t) => getAddress(t)),
      maxAmountsIn: balancesBN,
      userData: initUserData,
      fromInternalBalance: false,
    };

    const vault = await getVault();

    // Vault needs approval to pull the tokens in
    await approveTokensIfNeeded(tokens, recipient, vault.address);

    const rx = await awaitTransactionComplete(
      await vault.joinPool(poolId, recipient, recipient, joinPoolRequest),
    );

    logger.success('INIT_JOIN complete');

    return rx;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function doPoolJoin(
  poolId: string,
  tokens: string[],
  initialBalances: string[],
  recipient: string,
  joinKind: JoinKind,
) {
  try {
    logger.info('Starting join for pool id: ' + poolId);

    // convert to BigNumber before encoding
    const balancesBN = initialBalances.map((a) => parseUnits(a));

    // Must be encoded
    const initUserData = defaultAbiCoder.encode(
      ['uint256', 'uint256[]'],
      [joinKind, balancesBN],
    );

    const joinPoolRequest: JoinPoolRequest = {
      assets: tokens.map((t) => getAddress(t)),
      maxAmountsIn: balancesBN,
      userData: initUserData,
      fromInternalBalance: false,
    };

    const vault = await getVault();

    // Vault needs approval to pull the tokens in
    await approveTokensIfNeeded(tokens, recipient, vault.address);

    const rx = await awaitTransactionComplete(
      await vault.joinPool(poolId, recipient, recipient, joinPoolRequest),
    );

    logger.success('Pool join complete');

    return rx;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function authorizeToPauseWeightedPool(poolAddress: string) {
  const pool = await getWeightedPoolToken(poolAddress);
  const timelock = await getTimelockAuthorizer();
  const action = await timelock.getActionId(getSighash(pool, 'pause'));
  await grantVaultAuthorizerPermissions([action], [pool.address]);
}

export async function getPoolGaugeInstance(poolId: string) {
  const pools = await getAllPoolConfigs();
  const pool = pools.find((p) => p.poolId === poolId);
  if (!pool) throw new Error(`Pool ${poolId} not found`);

  if (!pool.gauge.address) logger.error(`Pool does not have a gauge address`);

  return getLiquidityGaugeInstance(pool.gauge.address);
}

// When paired with a stable for now
export function findOptimalBalancesForStablePriceTarget(
  pool: PoolCreationConfig,
) {
  _require(pool.type === PoolType.Weighted, 'Not a weighted pool');
  _require(!!pool.mainToken, 'Main token not set');
  _require(
    !!pool.mainTokenTargetPrice && pool.mainTokenTargetPrice > 0,
    'Target price not set',
  );
  _require(
    !!pool.amountOutOtherToken && pool.amountOutOtherToken > 0,
    'Output amount not set',
  );

  const tokenIn = <WeightedTokenInfo>(
    pool.tokenInfo.find((t) => t.address === pool.mainToken)
  );
  const weightIn = tokenIn.weight;
  // some sort of while loop to find this
  let amountOut = 0;
  let initalBalanceIn = 1.1;
  let initialBalanceOut = 1;
  let closeEnough = false;

  while (!closeEnough) {
    // calcOutGivenIn();
  }
}

/**
 * Makes assertions against the JSON fields/configuration for a pool.
 * @param pool
 */
export function validatePoolConfig(pool: PoolCreationConfig) {
  logger.info(`validatePoolConfig: Validating pool config`);

  _require(!!pool.type, '!pool type');
  _require(pool.type in PoolType, '!invalid pool type');

  pool.tokenInfo.forEach((info) => {
    if (pool.type === PoolType.Weighted) {
      _require(!!info.weight, '!token info weight');
    }

    _require(!!info.address, '!token info address');
    _require(!!info.initialBalance?.length, '!token info init balance');
  });

  if (pool.type === PoolType.Stable) {
    _require(!!pool.amp, '!Amp not provided');
  }

  _require(!!pool.deploymentArgs.swapFeePercentage, `!swapFeePercentage`);
  _require(!!pool.deploymentArgs.name, `!name`);
  _require(!!pool.deploymentArgs.symbol, `!symbol`);
  // Owner is auto added from admin signer account if one is not assigned in config (eg. creating for someone else)
  _require(!!pool.deploymentArgs.owner, `!owner`);

  _require(!!pool.gauge, '!gauge info');
  _require(!!pool.gauge.startingWeight, '!gauge startingWeight');
  if (!pool.isVePool) {
    _require(pool.gauge.depositFee >= 0, '!gauge depositFee');
    _require(pool.gauge.withdrawFee >= 0, '!gauge withdrawFee');
  }

  logger.success(`validatePoolConfig: Validation all good`);
}

export async function replaceTokenAddressesForChain(pool: PoolCreationConfig) {
  validatePoolConfig(pool);

  const chainId = await getChainId();
  for (const token of pool.tokenInfo) {
    // These will have to match for this to work
    const address = TOKENS[token.symbol][chainId];
    if (!address)
      throw new Error(
        `No replacement address for ${token.symbol} - chain id: ${chainId}`,
      );

    token.address = address;
  }

  await updatePoolConfig(pool);
}

export function getPoolAddress(poolId: string) {
  return poolId.slice(0, 42);
}
