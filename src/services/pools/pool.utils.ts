import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import * as fs from 'fs-extra';
import { join } from 'path';
import {
  PoolTokenInfo,
  PoolCreationConfig,
  CreateWeightedPoolArgs,
  StablePoolCreationArgs,
} from 'src/types/pool.types';
import { CHAIN_KEYS, getChainId } from 'src/utils/account.util';
import { logger } from 'src/utils/logger';

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
