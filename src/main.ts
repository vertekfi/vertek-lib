import { config } from 'dotenv';
import { BigNumber, Contract } from 'ethers';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { join } from 'path';
import { calcOutGivenIn } from './math';
import { updateWrappedAaltoFeeExempt } from './projects/aalto/services/admin.service';
import {
  getAdapterActionIdAndVaultGrantOnTarget,
  getSighash,
  grantVaultAuthorizerPermissions,
  performAuthEntrypointAction,
} from './services/auth/auth';
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
import { GaugeTypeNum } from './types/gauge.types';
import { getDefaultChainProvider, getSigner } from './utils/account.util';
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

  // await checkpointAllGauges();
  // await checkpointFeeDistributor();

  // const feesManager = new FeeManagementAutomation();
  // const data = await feesManager.getFeeCollectorNonZeroTokenBalances();
  // console.log(data);

  const nextIndex = await getNextPoolIndex();

  const pool = await getPoolConfig(nextIndex);
  //
  // await doPoolCreationSteps();
  //
  // await addRewardTokenToGauge(pool.gauge.address, getTokenAddress('AMES'));
  // await sleep();
  // await addRewardTokenToGauge(
  //   pool.gauge.address,
  //   getTokenAddress('LION_SHARE'),
  // );
  // await sleep();
  // await addRewardTokenToGauge(pool.gauge.address, getTokenAddress('ASHARE'));
  // await sleep();
  // await addRewardTokenToGauge(pool.gauge.address, getTokenAddress('LION'));
  // await sleep();
  // await addRewardTokenToGauge(pool.gauge.address, getTokenAddress('SERENE'));

  // await doGaugeRewardTokenDeposit(
  //   pool.gauge.address,
  //   getTokenAddress('AMES'),
  //   parseEther('7000'),
  // );
  // await sleep();
  // await doGaugeRewardTokenDeposit(
  //   pool.gauge.address,
  //   getTokenAddress('LION_SHARE'),
  //   parseEther('1250'),
  // );
  // await sleep();
  // await doGaugeRewardTokenDeposit(
  //   pool.gauge.address,
  //   getTokenAddress('ASHARE'),
  //   parseEther('500'),
  // );
  // await sleep();
  // await doGaugeRewardTokenDeposit(
  //   pool.gauge.address,
  //   getTokenAddress('LION'),
  //   parseEther('2000'),
  // );
  // await sleep();
  // await doGaugeRewardTokenDeposit(
  //   pool.gauge.address,
  //   getTokenAddress('SERENE'),
  //   parseEther('5'),
  // );
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
