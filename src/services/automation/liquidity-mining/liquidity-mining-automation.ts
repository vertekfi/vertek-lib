import { performAuthEntrypointAction } from 'src/services/auth/auth';
import { checkpointAllGauges } from 'src/services/gauges/gauge-utils';
import { ChainProvider } from 'src/types/account.types';
import { _require } from 'src/utils';
import { getCurrentBlockTimestamp } from 'src/utils/block.utils';
import {
  getFeeDistributor,
  getGaugeController,
  getSingleRecipientGauge,
  getTokenAdmin,
} from 'src/utils/contract.utils';
import { doTransaction } from 'src/utils/transaction.utils';

export class LiquidityMiningAutomation {
  constructor(private readonly account: ChainProvider) {}

  // Weekly after admins weekly epoch ticks over
  // Not doing this(can't depend on external parties) will cause the end total supply to increase
  async updateMiningParameters() {
    const tokenAdmin = await getTokenAdmin();

    // Current weekly epoch needs to have passed
    let adminNextEpochStart: number = (
      await tokenAdmin.getFutureEpochTime()
    ).toNumber();
    const blockTime = await getCurrentBlockTimestamp(this.account);

    _require(
      blockTime >= adminNextEpochStart,
      'Next token admin epoch has not started',
    );

    await doTransaction(tokenAdmin.updateMiningParameters());
  }

  // Before end of each epoch
  async checkpointGauges() {
    await checkpointAllGauges();
    // Checkpoint controller while we're at it then
    const controller = await getGaugeController();
    await doTransaction(controller.checkpoint());
  }

  // Before end of each epoch?
  async checkpointStakelessGauge() {
    await performAuthEntrypointAction(
      await getSingleRecipientGauge(),
      'checkpoint',
    );
  }

  // Start of each epoch week
  async checkpointFeeDistributor() {
    const feeDistributor = await getFeeDistributor();
    await doTransaction(feeDistributor.checkpoint());
  }
}
