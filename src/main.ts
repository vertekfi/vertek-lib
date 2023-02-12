import { config } from 'dotenv';
import { BigNumber, Contract } from 'ethers';
import {
  formatEther,
  getAddress,
  parseEther,
  parseUnits,
} from 'ethers/lib/utils';
import { join } from 'path';
import { calcOutGivenIn } from './math';
import { updateWrappedAaltoFeeExempt } from './projects/aalto/services/admin.service';
import {
  getAdapterActionIdAndVaultGrantOnTarget,
  getSighash,
  grantVaultAuthorizerPermissions,
  performAuthEntrypointAction,
} from './services/auth/auth';
import { doPoolFeeWithdraw } from './services/automation/fees/fee-action.utils';
import { FeeManagementAutomation } from './services/automation/fees/fees-automation';
import { checkpointFeeDistributor } from './services/automation/liquidity-mining/liquidity-mining-automation';
import { ScheduledJobService } from './services/automation/scheduled-job.service';
import {
  addLiquidityGaugeToController,
  addRewardTokenToGauge,
  checkpointAllGauges,
  checkpointStakelessGauge,
  createLiquidityGauge,
  doGaugeRewardTokenDeposit,
  GaugeFeeType,
  getGaugeWeights,
  setGaugeWeightCap,
  updateGaugeFee,
} from './services/gauges/gauge-utils';
import {
  increaseStakeForUser,
  stakeForUser,
} from './services/gauges/voting-escrow';
import {
  createConfigWeightedPool,
  doPoolInitJoin,
} from './services/pools/pool-creation';
import { getPoolConfig } from './services/pools/pool.utils';
import { getDefaultSingleTokenExitRequest } from './services/vault/vault-utils';
import { GaugeTypeNum } from './types/gauge.types';
import {
  getDefaultChainProvider,
  getSigner,
  getSignerAddress,
} from './utils/account.util';
import { getCurrentBlockTimestamp } from './utils/block.utils';
import {
  getAllPoolsWithGauges,
  getAuthorizerAdapter,
  getBalMinter,
  getContractAddress,
  getFeeDistributor,
  getGaugeController,
  getLiquidityGaugeInstance,
  getNextPoolIndex,
  getProtocolFeesCollector,
  getSingleRecipientGauge,
  getTokenAddress,
  getTokenAdmin,
  getVotingEscrow,
  getWeightedPoolToken,
} from './utils/contract.utils';
import { getBalanceForToken } from './utils/token.utils';
import {
  awaitTransactionComplete,
  doTransaction,
  sleep,
} from './utils/transaction.utils';

config({ path: join(process.cwd(), '.env') });

async function run() {
  console.log('VertekFi run:');
  await runSetup();

  // await checkpointAllGauges();
  // await checkpointFeeDistributor();

  // TODO: ....All this shit is coming to a point of needing a UI.
  // Scheduled automation is fine, but need to be able to see/save/do things on a "click" as well now

  const poolId =
    '0x016fcb8c8cb43bd0afb0be7486aadee49783487c00020000000000000000002d'; // PEBBLE-ETH
  await doPoolFeeWithdraw(poolId);
}

async function doPoolCreationSteps() {
  const nextIndex = await getNextPoolIndex();

  // await createConfigWeightedPool(
  //   nextIndex,
  //   getContractAddress('WeightedFactoryHighFee'),
  // );

  const pool = await getPoolConfig(nextIndex);
  // await doPoolInitJoin(pool);
  // await createLiquidityGauge(pool);
  // await updateGaugeFee(
  //   pool.gauge.address,
  //   GaugeFeeType.Deposit,
  //   pool.gauge.depositFee,
  // );
  // await updateGaugeFee(
  //   pool.gauge.address,
  //   GaugeFeeType.Withdraw,
  //   pool.gauge.withdrawFee,
  // );
  // await addLiquidityGaugeToController(pool, GaugeTypeNum.Ethereum);
}

async function runSetup() {
  const jobService = new ScheduledJobService();
  jobService.init();
}

run();
