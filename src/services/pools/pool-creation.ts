import { ContractReceipt } from 'ethers';
import { PoolCreationConfig, PoolType } from 'src/types/pool.types';
import { _require } from 'src/utils';
import { getSignerAddress } from 'src/utils/account.util';
import { logger } from 'src/utils/logger';
import {
  getAllPoolConfigs,
  getWeightedPoolArgsFromConfig,
  updatePoolConfig,
} from './pool.utils';
import { createWeightedPool, getPoolCreationData } from './pools';

export async function createConfigWeightedPool(poolConfigIndex: number) {
  const pools = await getAllPoolConfigs();
  const pool = pools[poolConfigIndex];

  if (pool.created) {
    throw new Error(`Pool ${pool.name} already created`);
  }

  validatePoolConfig(pool);

  const args = getWeightedPoolArgsFromConfig(pool, await getSignerAddress());

  const receipt = await createWeightedPool(args);

  pool.created = true;
  pool.txHash = receipt.transactionHash;
  pool.deploymentArgs = {
    ...pool.deploymentArgs,
    ...args,
  };
  await updatePoolConfig(pool);

  const poolAddress = tryGetPoolAddressFromReceipt(receipt);
  if (!poolAddress) {
    return;
  }

  const poolData = await getPoolCreationData(
    '0xD8C27d007AC23d0196f8f30551C40673E08CeaA7',
  );
  if (!poolData) {
    return;
  }

  await updatePoolConfig({
    ...pool,
    ...poolData,
  });

  // const rx = await initWeightedJoin(
  //   vaultAddress,
  //   pool.poolId,
  //   pool.deploymentArgs.tokens,
  //   pool.deploymentArgs.initialBalances,
  //   signer.address,
  //   signer
  // );
}

function tryGetPoolAddressFromReceipt(receipt: ContractReceipt) {
  try {
    // We need to get the new pool address out of the PoolCreated event
    const events = receipt.events.filter((e) => e.event === 'PoolCreated');
    const poolAddress = events[0].args.pool;
    console.log(poolAddress);
    return poolAddress;
  } catch (error) {
    logger.error(`Unable to get pool address`);
    console.log(receipt.events);
    return null;
  }
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
