import { checkpointAllGauges } from 'src/services/gauges/gauge-utils';
import { ChainProvider } from 'src/types/account.types';
import { _require } from 'src/utils';
import { getCurrentBlockTimestamp } from 'src/utils/block.utils';
import { getGaugeController, getTokenAdmin } from 'src/utils/contract.utils';
import { doTransaction } from 'src/utils/transaction.utils';

export class LiquidityMiningAutomation {
  constructor(private readonly account: ChainProvider) {}

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

  async checkpointGauges() {
    await checkpointAllGauges();
    const controller = await getGaugeController();
    await doTransaction(controller.checkpoint());
  }

  async checkpointFeeDistributor() {}
}
