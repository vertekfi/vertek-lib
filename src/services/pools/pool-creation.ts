import { Contract, ContractReceipt, Event } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import {
  CreateWeightedPoolArgs,
  PoolCreationConfig,
  PoolType,
} from 'src/types/pool.types';
import { _require } from 'src/utils';
import {
  getChainId,
  getSigner,
  getSignerAddress,
} from 'src/utils/account.util';
import { getContractAddress } from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import {
  getAllPoolConfigs,
  getDexPoolDataConfig,
  getPoolCreationData,
  getPoolId,
  getWeightedPoolArgsFromConfig,
  initWeightedJoin,
  updateDexPoolDataConfig,
  updatePoolConfig,
} from './pool.utils';

export async function createConfigWeightedPool(poolConfigIndex: number) {
  const pools = await getAllPoolConfigs();
  const pool = pools[poolConfigIndex];

  if (pool.created) {
    throw new Error(`Pool ${pool.name} already created`);
  }

  validatePoolConfig(pool);

  const args = getWeightedPoolArgsFromConfig(pool, await getSignerAddress());
  pool.deploymentArgs = args;
  await updatePoolConfig(pool);

  const receipt = await createWeightedPool(args);

  pool.created = true;
  pool.txHash = receipt.transactionHash;
  pool.deploymentArgs = {
    ...pool.deploymentArgs,
    ...args,
  };
  await updatePoolConfig(pool);

  // Will have to etherscan it or run a function over the txHash after a delay
  const poolData = await tryGetPoolAddressFromReceipt(receipt);
  if (!poolData.poolAddress) {
    pool.txHash = poolData.txHash;
    await updatePoolConfig(pool);
    return;
  }

  await updatePoolConfig({
    ...pool,
    ...poolData,
  });

  await completeWeightedSetup(poolData.poolAddress);
}

export async function completeWeightedSetup(poolAddress: string) {
  const pools = await getAllPoolConfigs();
  let pool = pools.find((p) => p.poolAddress === poolAddress);

  _require(!!pool, 'Pool not found');

  const poolData = await getPoolCreationData(poolAddress);
  if (!poolData) {
    return;
  }

  await updatePoolConfig({
    ...pool,
    ...poolData,
  });

  await initWeightedJoin(
    poolData.poolId,
    pool.deploymentArgs.tokens,
    pool.deploymentArgs.initialBalances,
    await getSignerAddress(),
  );

  pool.initJoinComplete = true;
  pool = await updatePoolConfig(pool);

  const dexPoolData = await getDexPoolDataConfig();
  dexPoolData[await getChainId()].incentivizedPools.push(pool.poolId);
  await updateDexPoolDataConfig(dexPoolData);
}

async function tryGetPoolAddressFromReceipt(receipt: ContractReceipt) {
  try {
    // We need to get the new pool address out of the PoolCreated event
    // const events = receipt.events.filter(
    //   (e: Event) => e.event && e.event === 'PoolCreated',
    // );
    // if (!events.length) {
    //   logger.error(`Unable to get pool address`);
    //   console.log(await receipt.events[0].getTransaction());
    //   return null;
    // }
    // Working differently now for some reason
    // But this should pull out the new pool address
    const poolAddress = receipt.events[0].address;
    console.log('poolAddress: ' + poolAddress);
    const poolId = receipt.events[1].topics[1];
    console.log('poolId: ' + poolId);
    return {
      txHash: receipt.transactionHash,
      poolId,
      poolAddress,
      date: new Date().toLocaleString(),
    };
  } catch (error) {
    logger.error(`Unable to get pool address`);
    // console.log(receipt.events);
    return {
      txHash: receipt.transactionHash,
      date: new Date().toLocaleString(),
    };
  }
}

export async function createWeightedPool(
  args: CreateWeightedPoolArgs,
): Promise<ContractReceipt> {
  logger.info('createWeightedPool: creating pool...');
  const factory = new Contract(
    getContractAddress('WeightedPoolFactory'),
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

export function validatePoolConfig(pool: PoolCreationConfig) {
  logger.info(`validatePoolConfig: Validating pool config`);

  _require(!!pool.type, '!pool type');
  _require(pool.type in PoolType, '!invalid pool type');

  pool.tokenInfo.forEach((info) => {
    if (pool.type === PoolType.Weighted) {
      _require(!!info.weight, '!token info weight');
    }

    // Gov token gets auto added later
    if (!pool.isVePool) {
      _require(!!info.address, '!token info address');
    }

    _require(!!info.initialBalance?.length, '!token info init balance');
  });

  if (pool.type === PoolType.Stable) {
    _require(!!pool.amp, '!Amp not provided');
  }

  _require(!!pool.deploymentArgs.swapFeePercentage, `!swapFeePercentage`);
  _require(!!pool.deploymentArgs.name, `!name`);
  _require(!!pool.deploymentArgs.symbol, `!symbol`);
  // owner will be auto attached to deploy args later

  _require(!!pool.gauge, '!gauge info');
  _require(!!pool.gauge.startingWeight, '!gauge startingWeight');

  logger.success(`validatePoolConfig: Validation all good`);
}
