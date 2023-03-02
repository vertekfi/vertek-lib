import { config } from 'dotenv';
import { BigNumber, Contract, ethers } from 'ethers';
import {
  formatEther,
  getAddress,
  parseEther,
  parseUnits,
} from 'ethers/lib/utils';
import { join } from 'path';
import {
  updateAaltoFeeExempt,
  updateListAaltoAndWrappedFeeExempt,
  updateWrappedAaltoFeeExempt,
} from './projects/aalto/services/admin.service';
import {
  getAdapterActionIdAndVaultGrantOnTarget,
  getSighash,
  grantVaultAuthorizerPermissions,
  performAuthEntrypointAction,
} from './services/auth/auth';
import {
  depositVeFees,
  doGaugeFeeWithdraws,
  doPoolFeeWithdraw,
  withdrawFeesFromCollector,
} from './services/automation/fees/fee-action.utils';
import { getGaugeFeeDistributionAmounts } from './services/automation/fees/fee-data.utils';
import {
  feeAutomation,
  FeeManagementAutomation,
} from './services/automation/fees/fees-automation';
import {
  checkpointFeeDistributor,
  withdrawTokenHolderBalance,
} from './services/automation/liquidity-mining/liquidity-mining-automation';
import { ScheduledJobService } from './services/automation/scheduled-job.service';
import {
  addLiquidityGaugeToController,
  addRewardTokenToGauge,
  changeGaugeTypeWeight,
  checkpointAllGauges,
  checkpointGaugeController,
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
  getRpcProvider,
  getSigner,
  getSignerAddress,
} from './utils/account.util';
import { getCurrentBlockTimestamp } from './utils/block.utils';
import {
  getAllPoolsWithGauges,
  getAuthorizerAdapter,
  getBalMinter,
  getBalTokenHolder,
  getContractAddress,
  getERC20,
  getFeeDistributor,
  getGaugeController,
  getLiquidityGaugeInstance,
  getNextPoolIndex,
  getProtocolFeesCollector,
  getSingleRecipientGauge,
  getTimelockAuthorizer,
  getTokenAddress,
  getTokenAdmin,
  getVotingEscrow,
  getVRTK,
  getWeightedPoolToken,
} from './utils/contract.utils';
import { approveTokensIfNeeded, getBalanceForToken } from './utils/token.utils';
import { doTransaction, sleep } from './utils/transaction.utils';
import * as moment from 'moment-timezone';
import {
  addBribeGauges,
  addBribeTokenOptions,
} from './services/bribes/bribe.utils';
import { getEventData } from './utils/event-scraping';
import { vertekBackendClient } from './services/subgraphs/vertek/vertek-backend-gql-client';

config({ path: join(process.cwd(), '.env') });

async function run() {
  console.log('VertekFi run:');

  // runSetup();

  // const pool = await getWeightedPoolToken(
  //   '0xDD64E2EC144571b4320f7BFB14a56b2b2cBF37ad',
  // );
  // const fee = await pool.balanceOf(
  //   '0xAc8E65B3B925bf09a330549ed092E2ECE2B38712',
  // );
  // console.log(formatEther(fee));

  // const gc = await getGaugeController();
  // const tt = (await gc.time_total()).toNumber();
  // console.log(new Date(tt * 1000).toUTCString());
  // console.log(tt);

  // await getGaugeWeights(1678320000);

  // await changeGaugeTypeWeight(GaugeTypeNum.veVRTK, 32);
  // await getGaugeWeights(1677715200);
  // await checkpointAllGauges();
  // await checkpointStakelessGauge();
  // await checkpointFeeDistributor();
  // await checkpointGaugeController();

  // const feeCollector = await getProtocolFeesCollector();
  // const provider = await getRpcProvider();
  // const endBlock = await provider.getBlockNumber();
  // const startBlock = endBlock - 6048000;
  // await getEventData(
  //   feeCollector,
  //   'SwapFeePercentageChanged',
  //   startBlock,
  //   endBlock,
  //   5000,
  //   (evt) => {
  //     console.log(evt);
  //   },
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

function runSetup() {
  const jobService = new ScheduledJobService();
  jobService.init();
}

run();
