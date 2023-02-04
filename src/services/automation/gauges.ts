import { getGaugeController } from '../../utils/contract.utils';
import { doTransaction } from '../../utils/transaction.utils';

export async function checkpointController() {
  const controller = await getGaugeController();
  await doTransaction(controller.checkpoint());
}

export async function checkpointGauge(address: string) {
  const controller = await getGaugeController();
  await doTransaction(controller.checkpoint_gauge(address));
}
