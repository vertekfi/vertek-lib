import { formatEther } from 'ethers/lib/utils';
import { performAuthEntrypointAction } from 'src/services/auth/auth';
import { checkpointAllGauges } from 'src/services/gauges/gauge-utils';
import { ChainProvider } from 'src/types/account.types';
import { _require } from 'src/utils';
import { getSignerAddress } from 'src/utils/account.util';
import { getCurrentBlockTimestamp } from 'src/utils/block.utils';
import {
  getBalTokenHolder,
  getContractAddress,
  getFeeDistributor,
  getGaugeController,
  getSingleRecipientGauge,
  getTokenAdmin,
  getVRTK,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { doTransaction } from 'src/utils/transaction.utils';

export class LiquidityMiningAutomation {
  constructor(private readonly account: ChainProvider) {}

  // Weekly after admins weekly epoch ticks over
  // Not doing this(can't depend on external parties) will cause the end total supply to increase
  // @note Other contracts can trigger this. So may fail
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
  }

  // At the start of a new epoch this should claim it's rewards (if it was checkpointed in last epoch)
  async checkpointStakelessGauge() {
    await performAuthEntrypointAction(
      await getSingleRecipientGauge(),
      'checkpoint',
    );
  }

  // Start of each epoch week
  async checkpointFeeDistributor() {
    await checkpointFeeDistributor();
  }
}

// Will checkpoint voting escrow in the process
export async function checkpointFeeDistributor() {
  const feeDistributor = await getFeeDistributor();
  await doTransaction(feeDistributor.checkpoint());
}

export async function withdrawTokenHolderBalance() {
  const vrtk = await getVRTK();
  const holderBalance = await vrtk.balanceOf(
    getContractAddress('BalTokenHolder'),
  );
  const devAddress = await getSignerAddress();
  const devAccountBalance = await vrtk.balanceOf(devAddress);
  logger.info(`token holder balance: ${formatEther(holderBalance)}`);

  logger.info(`dev account balance: ${formatEther(devAccountBalance)}`);

  const tokenHolder = await getBalTokenHolder();
  await doTransaction(
    tokenHolder.withdrawFunds(await getSignerAddress(), holderBalance),
  );

  logger.success(
    `new dev account balance: ${formatEther(await vrtk.balanceOf(devAddress))}`,
  );
}
