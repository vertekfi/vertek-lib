import { Contract, ContractReceipt } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import {
  ComposableStableV3Params,
  CreateWeightedPoolArgs,
  PoolCreationConfig,
} from 'src/types/pool.types';
import * as ComposableStablePoolFactoryV3Abi from '../../abis/ComposableStablePoolFactoryV3.json';
import { _require } from 'src/utils';
import { getSigner, getSignerAddress } from 'src/utils/account.util';
import { getContractAddress } from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';

import {
  getAllPoolConfigs,
  getWeightedPoolArgsFromConfig,
  initWeightedJoin,
  updatePoolConfig,
  validatePoolConfig,
} from './pool.utils';

export async function createConfigWeightedPool(
  poolConfigIndex: number,
  factoryAddress: string,
) {
  const pools = await getAllPoolConfigs();
  let pool = pools[poolConfigIndex];

  if (!pool) {
    logger.error(`Invalis poolConfigIndex: ${poolConfigIndex}`);
    return;
  }

  if (pool.created) {
    logger.error(`Pool ${pool.name} already created`);
    return;
  }

  if (!pool.deploymentArgs.owner) {
    logger.warn(
      `No owner set for pool "${pool.name}". Assigning local account as owner`,
    );

    pool.deploymentArgs.owner = await getSignerAddress();
    pool = await updatePoolConfig(pool);
  }

  validatePoolConfig(pool);

  // use util to format deployment args properly
  const args = getWeightedPoolArgsFromConfig(pool, await getSignerAddress());
  pool.deploymentArgs = args;
  pool = await updatePoolConfig(pool);

  // create the pool contract
  const receipt = await createWeightedPool(args, factoryAddress);

  // update local data for pool
  pool.created = true;
  pool.txHash = receipt.transactionHash;
  pool.deploymentArgs = {
    ...pool.deploymentArgs,
    ...args,
  };
  pool.name = pool.deploymentArgs.name;
  pool.symbol = pool.deploymentArgs.symbol;
  pool = await updatePoolConfig(pool);

  // Hard coded indexes by knowing the structure of this tx log
  // (If it needed to change would mean a whole bunch of other shit would too)
  const poolAddress = receipt.events[0].address;
  console.log('poolAddress: ' + poolAddress);
  const poolId = receipt.events[1].topics[1];
  console.log('poolId: ' + poolId);

  pool.poolId = poolId;
  pool.poolAddress = poolAddress;
  pool = await updatePoolConfig(pool);
  return pool;
}

export async function doPoolInitJoin(pool: PoolCreationConfig) {
  await initWeightedJoin(
    pool.poolId,
    pool.deploymentArgs.tokens,
    pool.deploymentArgs.initialBalances,
    await getSignerAddress(),
  );

  pool.initJoinComplete = true;
  pool = await updatePoolConfig(pool);
}

export async function createWeightedPool(
  args: CreateWeightedPoolArgs,
  factoryAddress: string,
): Promise<ContractReceipt> {
  logger.info('createWeightedPool: creating pool...');
  const factory = new Contract(
    factoryAddress,
    [
      `function create(
      string  name,
      string  symbol,
      address[]  tokens,
      uint256[]  normalizedWeights,
      address[]  rateProviders,
      uint256 swapFeePercentage,
      address owner
  ) external returns (address) `,
    ],
    await getSigner(),
  );

  const tx = await factory.create(
    args.name,
    args.symbol,
    args.tokens,
    args.weights.map((w) => parseUnits(w)),
    args.rateProviders,
    parseUnits(args.swapFeePercentage),
    args.owner,
  );

  return await awaitTransactionComplete(tx);
}

export async function createComposableStableV3() {
  // const params: ComposableStableV3Params = {
  //   name: string;
  //   symbol: string;
  //   tokens: string[];
  //   swapFeePercentage: string;
  //   owner: string;
  //   rateProviders?: string[];
  //   assetManagers?: string[];
  //   initialBalances?: string[];
  //   amplificationParameter: number;
  //   tokenRateCacheDurations: BigNumber[];
  //   exemptFromYieldProtocolFeeFlags: boolean[];
  // };

  const params = {};

  const factory = new Contract(
    getContractAddress('ComposableStablePoolFactoryV3'),
    ComposableStablePoolFactoryV3Abi,
    await getSigner(),
  );
}
