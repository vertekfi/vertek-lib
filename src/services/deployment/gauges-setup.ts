import { GaugeType, GaugeTypeNum } from 'src/types/gauge.types';
import { getChainId } from 'src/utils/account.util';
import {
  getContractAddress,
  getGaugeAdder,
  getGaugeController,
  getLiquidityGaugeFactory,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { performAuthEntrypointAction } from '../auth/auth';
import { validatePoolConfig } from '../pools/pool-creation';
import {
  getAllPoolConfigs,
  getDexPoolDataConfig,
  updateDexPoolDataConfig,
  updatePoolConfig,
} from '../pools/pool.utils';
import { initGaugeAuthItems } from './gauge-auth-setup';

export async function runGaugeSetup() {
  // await initGaugeAuthItems();
  // await addGaugeTypes();
  // await addGaugeFactories();
  // await createConfigPoolGauges();
  // await addConfigPoolGaugesToController();
}

export async function addGaugeTypes() {
  const gaugeController = await getGaugeController();
  //
  // Note from GaugeAdder contract:
  // Functions for the "LiquidityMiningCommittee" and "veBAL" types are purposefully omitted as there is
  // no reason for new gauges to be deployed for these types, so there is no need to expose methods to add them.
  //

  await performAuthEntrypointAction(gaugeController, 'add_type', [
    GaugeType.veBAL,
    1,
  ]);

  // We do not have this "Liquidity Mining Committee" concept right now.
  // Its all ve holders (veBAL gauge type) and "Ethereum" voting gauges (65/35).
  // But adding here to index align with GaugeAdder GaugeType enum.
  await performAuthEntrypointAction(gaugeController, 'add_type', [
    GaugeType.LiquidityMiningCommittee,
    1,
  ]);

  // Should be third item in local enum, enum index 2, to line up with contract enum GaugeType.Ethereum
  await performAuthEntrypointAction(gaugeController, 'add_type', [
    GaugeType.Ethereum,
    1,
  ]);
}

export async function addGaugeFactories() {
  // authorization should already be given
  const gaugeAdder = await getGaugeAdder();

  // Do not need entrypoint for this
  await awaitTransactionComplete(
    gaugeAdder.addGaugeFactory(
      getContractAddress('LiquidityGaugeFactory'),
      GaugeTypeNum.Ethereum,
    ),
  );
}

export async function createConfigPoolGauges() {
  const factory = await getLiquidityGaugeFactory();

  const pools = await getAllPoolConfigs();
  for (const pool of pools) {
    if (pool.gauge.added || pool.isVePool) {
      continue;
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
}

export async function addConfigPoolGaugesToController() {
  // authorization should already be given
  const gaugeController = await getGaugeController();

  const pools = await getAllPoolConfigs();
  for (const pool of pools) {
    if (pool.gauge.addedToController) {
      logger.warn(`Pool ${pool.name} already added to controller. Skipping`);
      continue;
    }

    if (!pool.gauge.address) {
      logger.warn(`No gauge address set for pool ${pool.name}. Skipping`);
      continue;
    }

    validatePoolConfig(pool);
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
}

export async function addMainPoolGauge() {
  // SingleRecipientGauge type (can not be voted for)
}
