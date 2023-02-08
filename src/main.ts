import { config } from 'dotenv';
import { BigNumber, Contract } from 'ethers';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { join } from 'path';
import {
  getAdapterActionIdAndVaultGrantOnTarget,
  getSighash,
  grantVaultAuthorizerPermissions,
  performAuthEntrypointAction,
} from './services/auth/auth';
import { ScheduledJobService } from './services/automation/scheduled-job.service';
import {
  addLiquidityGaugeToController,
  checkpointAllGauges,
  checkpointStakelessGauge,
} from './services/gauges/gauge-utils';
import {
  increaseStakeForUser,
  stakeForUser,
} from './services/gauges/voting-escrow';
import { getDefaultChainProvider, getSigner } from './utils/account.util';
import { getCurrentBlockTimestamp } from './utils/block.utils';
import {
  getAllPoolsWithGauges,
  getAuthorizerAdapter,
  getBalMinter,
  getFeeDistributor,
  getGaugeController,
  getLiquidityGaugeInstance,
  getSingleRecipientGauge,
  getTokenAdmin,
  getVotingEscrow,
} from './utils/contract.utils';
import {
  awaitTransactionComplete,
  doTransaction,
  sleep,
} from './utils/transaction.utils';

config({ path: join(process.cwd(), '.env') });

async function run() {
  console.log('VertekFi run:');
  await runSetup();
  //
  //
  // await checkpointAllGauges();
  //

  // await checkpointStakelessGauge()

  const gaugeController = await getGaugeController();

  // await performAuthEntrypointAction(gaugeController, 'add_type', ['veVRTK', 2]);

  // await performAuthEntrypointAction(gaugeController, 'add_gauge', [
  //   '0x1DdAC329f570dF5d83DfAC1720828276Ca49b129',
  //   3,
  //   parseEther('3500'),
  // ]);
}

async function runSetup() {
  const jobService = new ScheduledJobService();
  jobService.init();
}

run();
