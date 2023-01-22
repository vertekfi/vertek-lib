import { GaugeType, GaugeTypeNum } from 'src/types/gauge.types';
import {
  getContractAddress,
  getGaugeAdder,
  getGaugeController,
} from 'src/utils/contract.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { performAuthEntrypointAction } from '../auth/auth';
import { initGaugeAuthItems } from './gauge-auth-setup';

export async function runGaugeSetup() {
  //  await initGaugeAuthItems();
  // await addGaugeTypes();
  await addGaugeFactories();
}

export async function addGaugeTypes() {
  const gaugeController = await getGaugeController();
  //
  // Note from contract:
  // Functions for the "LiquidityMiningCommittee" and "veBAL" types are purposefully omitted as there is
  // no reason for new gauges to be deployed for these types so there is no need to expose methods to add them.
  //

  await performAuthEntrypointAction(gaugeController, 'add_type', [
    GaugeType.veBAL,
    1,
  ]);

  // We do not have this concept right now
  // Its all ve holders (veBAL gauge type) and "Ethereum" voting gauges (65/35)
  // But adding here to index align with GaugeAdder GaugeType enum
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

  // Don't need entrypoint for this
  await awaitTransactionComplete(
    gaugeAdder.addGaugeFactory(
      getContractAddress('LiquidityGaugeFactory'),
      GaugeTypeNum.Ethereum,
    ),
  );
}

export async function addConfigPoolGauges() {
  // veBAL gauge types (can be voted for)
  //
}

export async function addMainPoolGauge() {
  // SingleRecipientGauge type (can not be voted for)
}
