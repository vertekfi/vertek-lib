import { getGaugeController } from 'src/utils/contract.utils';
import { performAuthEntrypointAction } from '../auth/auth';
import { initGaugeAuthItems } from './gauge-auth-setup';

export async function runGaugeSetup() {
  // await initGaugeAuthItems();
  // await addGaugeTypes();
}

export async function addGaugeTypes() {
  const gaugeController = await getGaugeController();
  await performAuthEntrypointAction(gaugeController, 'add_type', [
    'veBalGaugeType',
    1,
  ]);
  await performAuthEntrypointAction(gaugeController, 'add_type', [
    'singleRecipientGaugeType',
    1,
  ]);
}

export async function addConfigPoolGauges() {
  // veBAL gauge types (can be voted for)
}

export async function addMainPoolGauge() {
  // SingleRecipientGauge type (can not be voted for)
}
