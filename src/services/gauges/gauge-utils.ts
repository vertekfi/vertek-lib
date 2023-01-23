import { BigNumber } from 'ethers';
import { GaugeType, GaugeTypeNum } from 'src/types/gauge.types';
import { PoolCreationConfig } from 'src/types/pool.types';
import { getSignerAddress } from 'src/utils/account.util';
import { ANY_ADDRESS } from 'src/utils/constants';
import {
  getBalancerPoolToken,
  getGaugeController,
  getLiquidityGaugeFactory,
  getLiquidityGaugeInstance,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { getAuthAdapterActionId } from '../auth/action-ids';
import {
  grantVaultAuthorizerPermissions,
  performAuthEntrypointAction,
} from '../auth/auth';
import { validatePoolConfig } from '../pools/pool-creation';
import {
  getDexPoolDataConfig,
  updateDexPoolDataConfig,
  updatePoolConfig,
} from '../pools/pool.utils';

/**
 * Caller should already be Vault authorized to call this function
 * @param address
 * @param token
 * @param distributor
 */
export async function addRewardToGauge(
  gaugeAddress: string,
  token: string,
  distributor?: string,
) {
  distributor = distributor ?? (await getSignerAddress());
  const gauge = await getLiquidityGaugeInstance(gaugeAddress);

  await approveTokensIfNeeded([token], distributor, gauge.address);

  return await performAuthEntrypointAction(gauge, 'add_reward', [
    token,
    distributor,
  ]);
}

/**
 * Caller should already be Vault authorized to call this function.
 * `addRewardToGauge` should have been called beforehand to add token plus set token approval for gauge.
 * @param address
 * @param token
 * @param distributor
 */
export async function depositRewardToGauge(
  gaugeAddress: string,
  token: string,
  amount: BigNumber,
) {
  const gauge = await getLiquidityGaugeInstance(gaugeAddress);
  return await performAuthEntrypointAction(gauge, 'deposit_reward_token', [
    token,
    amount,
  ]);
}

export async function doGaugeDeposit(gaugeAddress: string, amount: BigNumber) {
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
  if (pool.gauge.added || pool.isVePool) {
    logger.error(`Pool ${pool.name} gauge already created`);
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
export async function addGaugeToController(pool: PoolCreationConfig) {
  if (pool.gauge.addedToController) {
    logger.warn(`Pool ${pool.name} already added to controller. Skipping`);
    return;
  }

  if (!pool.gauge.address) {
    logger.warn(`No gauge address set for pool ${pool.name}. Skipping`);
    return;
  }

  validatePoolConfig(pool);

  const gaugeController = await getGaugeController();

  // Ethereum gauge types (can be voted for)
  const receipt = await performAuthEntrypointAction(
    gaugeController,
    'add_gauge',
    [pool.gauge.address, GaugeTypeNum.Ethereum, 0],
  );

  pool.gauge.addedToController = true;
  pool.gauge.controllerTxHash = receipt.transactionHash;
  await updatePoolConfig(pool);

  logger.success(`Pool ${pool.name} gauge added to controller`);

  // Add to the list for frontend while we're here
  const dexPoolData = await getDexPoolDataConfig();
  dexPoolData.gauges.push(pool.poolId);
  await updateDexPoolDataConfig(dexPoolData);
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
