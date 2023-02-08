import { config } from 'dotenv';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { join } from 'path';
import {
  getSighash,
  grantVaultAuthorizerPermissions,
  performAuthEntrypointAction,
} from './services/auth/auth';
import { ScheduledJobService } from './services/automation/scheduled-job.service';
import { checkpointAllGauges } from './services/gauges/gauge-utils';
import {
  increaseStakeForUser,
  stakeForUser,
} from './services/gauges/voting-escrow';
import { getDefaultChainProvider } from './utils/account.util';
import { getCurrentBlockTimestamp } from './utils/block.utils';
import {
  getAllPoolsWithGauges,
  getAuthorizerAdapter,
  getBalMinter,
  getFeeDistributor,
  getLiquidityGaugeInstance,
  getSingleRecipientGauge,
  getTokenAdmin,
  getVotingEscrow,
} from './utils/contract.utils';
import { doTransaction, sleep } from './utils/transaction.utils';

config({ path: join(process.cwd(), '.env') });

async function run() {
  console.log('VertekFi run:');
  await runSetup();
  //
  //
  // await checkpointAllGauges();
}

async function runSetup() {
  const jobService = new ScheduledJobService();
  jobService.init();
}

run();
