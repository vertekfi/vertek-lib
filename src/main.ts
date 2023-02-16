import { config } from 'dotenv';
import { BigNumber, Contract } from 'ethers';
import {
  formatEther,
  getAddress,
  parseEther,
  parseUnits,
} from 'ethers/lib/utils';
import { join } from 'path';
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
  doVertekPoolFeeWithdraw,
  withdrawFeesFromCollector,
} from './services/automation/fees/fee-action.utils';
import { saveGaugeFeesData } from './services/automation/fees/fee-data.utils';
import { FeeManagementAutomation } from './services/automation/fees/fees-automation';
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
import { getAllPendingProtocolFees } from './services/subgraphs/subgraph.utils';
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
  getBalTokenHolder,
  getContractAddress,
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
import {
  getAccountTokenBalances,
  getBalanceForToken,
} from './utils/token.utils';
import {
  awaitTransactionComplete,
  doTransaction,
  sleep,
} from './utils/transaction.utils';

config({ path: join(process.cwd(), '.env') });

async function run() {
  console.log('VertekFi run:');
  //  await runSetup();

  // Type weight can be used to keep the emissions ratio for veVRTK
  // await changeGaugeTypeWeight(GaugeTypeNum.veVRTK, 8);
  // await getGaugeWeights(1676505600); // TODO: Have to set a watcher for votes to update type weight on the fly
  // await checkpointAllGauges();
  // await checkpointStakelessGauge();
  // await checkpointFeeDistributor();
  // await checkpointGaugeController();

  // const poolId =
  //   '0x016fcb8c8cb43bd0afb0be7486aadee49783487c00020000000000000000002d'; // PEBBLE-ETH
  // await doPoolFeeWithdraw(poolId);

  const feeData = await getAllPendingProtocolFees();
  // console.log(feeData.feeCollector.values);
  // const data = await getAccountTokenBalances(
  //   feeData.feeCollector.values.map((p) => {
  //     return {
  //       address: p.poolAddress,
  //     };
  //   }),
  //   getContractAddress('ProtocolFeesCollector'),
  // );

  // console.log(data);
  // await withdrawFeesFromCollector(feeData.feeCollector.values);
  await saveGaugeFeesData(feeData.feeCollector.values);
  // await doGaugeFeeWithdraws(feeData.gauges.values);

  // await withdrawTokenHolderBalance();
  // await depositVeFees([getTokenAddress('VRTK')], [parseUnits('0')]);

  // const feeDist = await getFeeDistributor();
  // await doTransaction(feeDist.checkpointToken(vrtk.address));
  // const ts = (await feeDist.getTokenTimeCursor(vrtk.address)).toNumber();
  // console.log(new Date(ts * 1000).to());
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
