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
import { getVaultInstanceByAddress } from './services/vault/vault';
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
  //

  // await checkpointAllGauges();
  // await checkpointFeeDistributor();

  // const feesManager = new FeeManagementAutomation();
  // const data = await feesManager.getFeeCollectorNonZeroTokenBalances();
  // console.log(data);

  const poolId =
    '0x016fcb8c8cb43bd0afb0be7486aadee49783487c00020000000000000000002d'; // PEBBLE-ETH
  const pool = await getWeightedPoolToken(
    '0x016fcb8c8cb43bd0afb0be7486aadee49783487c',
  );
  const aeqVault = await getVaultInstanceByAddress(
    '0xEE1c8DbfBf958484c6a4571F5FB7b99B74A54AA7',
  );

  const [tokenInfo, devBalance] = await Promise.all([
    aeqVault.getPoolTokens(poolId),
    pool.balanceOf(await getSignerAddress()),
  ]);

  const tokenOut = getTokenAddress('ETH');
  const exitRequest = getDefaultSingleTokenExitRequest(
    tokenInfo.tokens,
    devBalance,
    tokenInfo.tokens.indexOf(tokenOut),
  );

  console.log(exitRequest);

  console.log(formatEther(await getBalanceForToken(tokenOut)));

  await aeqVault.exitPool(poolId, exitRequest);

  console.log(formatEther(await getBalanceForToken(tokenOut)));
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
