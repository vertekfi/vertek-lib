import { GaugeType, GaugeTypeNum } from 'src/types/gauge.types';
import { getChainId } from 'src/utils/account.util';
import {
  getContractAddress,
  getGaugeAdder,
  getGaugeController,
  getLiquidityGaugeFactory,
} from 'src/utils/contract.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import {
  addGaugeToController,
  addGaugeTypeToController,
  createLiquidityGauge,
} from '../gauges/gauge-utils';
import { validatePoolConfig } from '../pools/pool-creation';
import { getAllPoolConfigs } from '../pools/pool.utils';
import { initGaugeAuthItems } from './gauge-auth-setup';

export async function runGaugeSetup() {
  // await initGaugeAuthItems();
  // await addGaugeTypes();
  // await addGaugeFactories();
  await createConfigPoolGauges();
  await addConfigPoolGaugesToController();
}

export async function addGaugeTypes() {
  //
  // Note from GaugeAdder contract:
  // Functions for the "LiquidityMiningCommittee" and "veBAL" types are purposefully omitted as there is
  // no reason for new gauges to be deployed for these types, so there is no need to expose methods to add them.
  //
  await addGaugeTypeToController(GaugeType.veBAL, 1);

  // We do not have this "Liquidity Mining Committee" concept right now.
  // Its all ve holders (veBAL gauge type) and "Ethereum" voting gauges (65/35).
  // But adding here to index align with GaugeAdder GaugeType enum.
  await addGaugeTypeToController(GaugeType.LiquidityMiningCommittee, 0);

  // Should be third item in local enum, enum index 2, to line up with contract enum GaugeType.Ethereum
  await addGaugeTypeToController(GaugeType.Ethereum, 1);
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
  const pools = await getAllPoolConfigs();
  for (const pool of pools) {
    await createLiquidityGauge(pool);
  }
}

export async function addConfigPoolGaugesToController() {
  const pools = await getAllPoolConfigs();
  for (const pool of pools) {
    await addGaugeToController(pool);
  }
}

export async function addMainPoolGauge() {
  // SingleRecipientGauge type (can not be voted for)
}
