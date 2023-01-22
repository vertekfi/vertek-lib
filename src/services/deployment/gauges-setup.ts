import { initGaugeAuthItems } from './gauge-auth-setup';

export async function runGaugeSetup() {
  await initGaugeAuthItems();
}

export async function addGaugeTypes() {}

export async function addConfigPoolGauges() {
  // veBAL gauge types (can be voted for)
}

export async function addMainPoolGauge() {
  // SingleRecipientGauge type (can not be voted for)
}
