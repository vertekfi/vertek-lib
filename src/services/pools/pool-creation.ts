import { Contract, ContractReceipt } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import {
  CreateWeightedPoolArgs,
  PoolCreationConfig,
  PoolType,
} from 'src/types/pool.types';
import { _require } from 'src/utils';
import { getSigner, getSignerAddress } from 'src/utils/account.util';
import { getContractAddress } from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import {
  getAllPoolConfigs,
  getDexPoolDataConfig,
  getMainPoolConfig,
  getPoolCreationData,
  getWeightedPoolArgsFromConfig,
  initWeightedJoin,
  updateDexPoolDataConfig,
  updatePoolConfig,
} from './pool.utils';

export async function createMainPool(vertkAddress: string) {
  const pool = await getMainPoolConfig();

  const vrtkInfo = pool.tokenInfo.find((t) => t.symbol === 'VRTK');
  vrtkInfo.address = vertkAddress;
  await updatePoolConfig(pool);

  await createConfigWeightedPool(0);
}

export async function createConfigWeightedPool(poolConfigIndex: number) {
  const pools = await getAllPoolConfigs();
  const pool = pools[poolConfigIndex];

  if (pool.created) {
    logger.error(`Pool ${pool.name} already created`);
    return;
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

  // Add to the list for frontend while we're here
  const dexPoolData = await getDexPoolDataConfig();
  dexPoolData.incentivizedPools.push(pool.poolId);
  await updateDexPoolDataConfig(dexPoolData);
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

async function tryGetPoolAddressFromReceipt(receipt: ContractReceipt) {
  try {
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

    _require(!!info.address, '!token info address');
    _require(!!info.initialBalance?.length, '!token info init balance');
  });

  if (pool.type === PoolType.Stable) {
    _require(!!pool.amp, '!Amp not provided');
  }

  _require(!!pool.deploymentArgs.swapFeePercentage, `!swapFeePercentage`);
  _require(!!pool.deploymentArgs.name, `!name`);
  _require(!!pool.deploymentArgs.symbol, `!symbol`);
  _require(!!pool.deploymentArgs.owner, `!owner`);

  _require(!!pool.gauge, '!gauge info');
  _require(!!pool.gauge.startingWeight, '!gauge startingWeight');

  logger.success(`validatePoolConfig: Validation all good`);
}
