import { BigNumber } from 'ethers';
import { GaugeType, GaugeTypeNum } from 'src/types/gauge.types';
import { PoolCreationConfig } from 'src/types/pool.types';
import { ZERO, _require } from 'src/utils';
import { getSignerAddress } from 'src/utils/account.util';
import {
  getGaugeController,
  getLiquidityGaugeFactory,
  getLiquidityGaugeInstance,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { performAuthEntrypointAction } from '../auth/auth';
import { updatePoolConfig, validatePoolConfig } from '../pools/pool.utils';

export enum GaugeFeeType {
  Deposit,
  Withdraw,
}

/**
 * Caller should already be Vault authorized to call this function.
 * @param address
 * @param token
 * @param distributor
 */
export async function addRewardTokenToGauge(
  gaugeAddress: string,
  token: string,
) {
  const gauge = await getLiquidityGaugeInstance(gaugeAddress);
  const distributor = await getSignerAddress();

  await approveTokensIfNeeded([token], distributor, gauge.address);
  // Registering a token requires going through auth adapter
  await performAuthEntrypointAction(gauge, 'add_reward', [token, distributor]);
}

/**
 * Requires already having been set as the tokens distributor for the gauge
 * @param gaugeAddress
 * @param token
 * @param amount
 */
export async function doGaugeRewardTokenDeposit(
  gaugeAddress: string,
  token: string,
  amount: BigNumber,
) {
  const gauge = await getLiquidityGaugeInstance(gaugeAddress);
  // Once auth approved
  await awaitTransactionComplete(gauge.deposit_reward_token(token, amount));
}

export async function doTestUserGaugeDeposit(
  gaugeAddress: string,
  amount: BigNumber,
) {
  const gauge = await getLiquidityGaugeInstance(gaugeAddress);

  await approveTokensIfNeeded(
    [await gauge.lp_token()],
    await getSignerAddress(),
    gauge.address,
  );

  return await awaitTransactionComplete(await gauge.deposit(amount));
}

export async function createLiquidityGauge(pool: PoolCreationConfig) {
  const factory = await getLiquidityGaugeFactory();
  if (pool.gauge.added) {
    logger.error(`Pool ${pool.name} gauge already created`);
    return;
  }

  if (pool.isVePool) {
    logger.warn(`Skipping liquidity gauge creation for VE pool "${pool.name}"`);
    return;
  }

  validatePoolConfig(pool);

  const receipt = await awaitTransactionComplete(
    factory.create(pool.poolAddress, 0),
  );

  pool.gauge.txHash = receipt.transactionHash;
  pool.gauge.added = true;
  pool.gauge.address = receipt.events[0].args.gauge;
  await updatePoolConfig(pool);

  logger.success(`Pool ${pool.name} gauge created`);
}

/**
 * Authorization Tto add to GaugeController should already be given before calling this
 * @param pool
 * @returns
 */
export async function addLiquidityGaugeToController(
  pool: PoolCreationConfig,
  gaugeType: GaugeTypeNum,
  startingWeight = ZERO,
) {
  if (pool.gauge.addedToController) {
    logger.warn(`Pool ${pool.name} already added to controller. Skipping`);
    return;
  }

  if (!pool.gauge.added || !pool.gauge.address) {
    logger.warn(`No gauge set for pool ${pool.name}. Skipping`);
    return;
  }

  validatePoolConfig(pool);

  const gaugeController = await getGaugeController();

  const receipt = await performAuthEntrypointAction(
    gaugeController,
    'add_gauge',
    [pool.gauge.address, gaugeType, startingWeight],
  );

  pool.gauge.addedToController = true;
  pool.gauge.controllerTxHash = receipt.transactionHash;
  await updatePoolConfig(pool);

  logger.success(`Pool ${pool.name} gauge added to controller`);

  // Add to the list for frontend while we're here
  // const dexPoolData = await getDexPoolDataConfig();
  // dexPoolData.gauges.push(pool.poolId);
  // await updateDexPoolDataConfig(dexPoolData);
}

export async function addGaugeTypeToController(
  type: GaugeType,
  weight: number,
) {
  const gaugeController = await getGaugeController();
  await performAuthEntrypointAction(gaugeController, 'add_type', [
    type,
    weight,
  ]);
}

export async function updateGaugeFee(
  gaugeAddress: string,
  feeType: GaugeFeeType,
  fee: number,
) {
  _require(fee <= 1000, 'Fee is above max');

  try {
    const gauge = await getLiquidityGaugeInstance(gaugeAddress);
    switch (feeType) {
      case GaugeFeeType.Deposit:
        return performAuthEntrypointAction(gauge, 'setDepositFee', [fee]);
      case GaugeFeeType.Withdraw:
        return performAuthEntrypointAction(gauge, 'setWithdrawFee', [fee]);
      default:
        throw new Error('Unknown gauge fee type: ' + feeType);
    }
  } catch (error) {
    logger.error('Setting gauge fee failed');
  }
}

/**
 * Sets the deposit and withdraw fees for a gauge based on the pools config values.
 * Auth permissions should have already been granted to do so.
 */
export async function setGaugeFees(pool: PoolCreationConfig) {
  logger.info(`setGaugeFees:`);

  if (pool.isVePool) {
    logger.error(`Can not set gauge fees for "${pool.name}"`);
    return;
  }

  if (!pool.gauge.added) {
    logger.warn(
      `Skipping gauge fee setting for pool "${pool.name}". Gauge not created`,
    );
    return;
  }

  if (pool.gauge.initFeesSet) {
    logger.warn(
      `Skipping gauge fee setting for pool "${pool.name}". Fees already set`,
    );
    return;
  }

  if (pool.gauge.depositFee > 0) {
    logger.success(`Setting gauge deposit fee..`);
    await updateGaugeFee(
      pool.gauge.address,
      GaugeFeeType.Deposit,
      pool.gauge.depositFee,
    );
  }

  if (pool.gauge.withdrawFee > 0) {
    logger.success(`Setting gauge withdraw fee..`);
    await updateGaugeFee(
      pool.gauge.address,
      GaugeFeeType.Withdraw,
      pool.gauge.withdrawFee,
    );
  }

  pool.gauge.initFeesSet = true;
  await updatePoolConfig(pool);
}
