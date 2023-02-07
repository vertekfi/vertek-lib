import {
  calcBptOutGivenExactTokensIn,
  calcInGivenOut,
  calcOutGivenIn,
} from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  addLiquidityGaugeToController,
  addRewardTokenToGauge,
  checkpointAllGauges,
  createLiquidityGauge,
  doGaugeRewardTokenDeposit,
  GaugeFeeType,
  getAllGaugePendingProtocolFees,
  updateGaugeFee,
} from './services/gauges/gauge-utils';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { stakeForUser } from './services/gauges/voting-escrow';
import {
  getAuthorizerAdapter,
  getGaugeController,
  getLiquidityGaugeFactory,
  getLiquidityGaugeInstance,
  getProtocolFeesCollector,
  getSingleRecipientGauge,
  getTimelockAuthorizer,
  getTokenAdmin,
  getVault,
  getVotingEscrow,
  getWeightedPoolToken,
} from './utils/contract.utils';
import {
  getMainPoolConfig,
  getPoolAddress,
  getPoolConfig,
  getPoolConfigByName,
  initWeightedJoin,
  updatePoolConfig,
} from './services/pools/pool.utils';
import {
  awaitTransactionComplete,
  doTransaction,
} from './utils/transaction.utils';
import { subgraphService } from './services/subgraphs/subgraph-client';
import * as moment from 'moment-timezone';
import {
  getSighash,
  grantVaultAuthorizerPermissions,
  performAuthEntrypointAction,
} from './services/auth/auth';
import { createConfigWeightedPool } from './services/pools/pool-creation';
import { getSignerAddress } from './utils/account.util';
import { GaugeTypeNum } from './types/gauge.types';
import {
  getActionId,
  getAuthAdapterActionId,
} from './services/auth/action-ids';
import {
  updateListAaltoAndWrappedFeeExempt,
  updateWrappedAaltoFeeExempt,
} from './projects/aalto/services/admin.service';
import { getWrappedAalto } from './projects/aalto/utils/aalto-contract.utils';
import { BigNumber } from 'ethers';
import { ANY_ADDRESS } from './utils/constants';
import { ScheduledJobService } from './services/automation/scheduled-job.service';

config({ path: join(process.cwd(), '.env') });

async function run() {
  console.log('VertekFi run:');
  runSetup();
  //
  //
}

async function runSetup() {
  const jobService = new ScheduledJobService();
  jobService.init();
}

run();
