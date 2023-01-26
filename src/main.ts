import {
  calcBptOutGivenExactTokensIn,
  calcInGivenOut,
  calcOutGivenIn,
} from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  activateTokenAdmin,
  giveBalMinterPermission,
  initBaseAuthSetup,
  setupTokenAdminBeforeActivation,
  updateVaultAuthorizer,
  updateVaultPauseAuth,
} from './services/deployment/base-setup';
import {
  createConfigWeightedPool,
  createMainPool,
  doPoolInitJoin,
} from './services/pools/pool-creation';
import { runPoolsSetup } from './services/pools/pools';
import {
  addMainPoolGaugeSetup,
  createConfigPoolGauges,
  runGaugeSetup,
  setGaugeFees,
} from './services/deployment/gauges-setup';
import {
  addGaugeToController,
  addRewardTokenToGauge,
  doGaugeRewardTokenDeposit,
  GaugeFeeType,
  updateGaugeFee,
} from './services/gauges/gauge-utils';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import {
  doInitialVotingEscrowDeposit,
  stakeForUser,
} from './services/gauges/voting-escrow';
import {
  getBalMinter,
  getGaugeController,
  getSighash,
  getTokenAddress,
  getTokenAdmin,
  getVault,
  getWeightedPoolToken,
} from './utils/contract.utils';
import {
  authorizeToPauseWeightedPool,
  doPoolJoin,
  getMainPoolConfig,
  getPoolConfig,
  initWeightedJoin,
} from './services/pools/pool.utils';
import { initGaugeAuthItems } from './services/deployment/gauge-auth-setup';
import { GaugeTypeNum } from './types/gauge.types';
import { getSignerAddress } from './utils/account.util';
import { awaitTransactionComplete } from './utils/transaction.utils';
import {
  canPerformAction,
  grantVaultAuthorizerPermissions,
} from './services/auth/auth';
import { getActionId } from './services/auth/action-ids';

async function run() {
  console.log('VertekFi run:');
  config({ path: join(process.cwd(), '.env') });

  // BNB@~$310 vrtk@$7 = 0.0225806452 BNB -> 1 VRTK ---- RATIO 180 TO 1 (VRTK -> BNB)
  // 10 BNB = $3,100, Need then 1800 VRTK = $12,600 ($15,700 initial liquidity value)
  //console.log(calcOutGivenIn(1, 0.7, 6.3, 0.3, 1)); // want 5 busd out for 1 ashare
  // console.log(calcOutGivenIn(42, 0.8, 0.25, 0.2, 1)); // want ~0.0222222 BNB for 1 vrtk
  await setupForNetwork();
}

async function setupForNetwork() {
  // await updateVaultAuthorizer();
  // await updateVaultPauseAuth();
  // await setupTokenAdminBeforeActivation();
  // await activateTokenAdmin();
  // await initGaugeAuthItems();
  // await doInitialVotingEscrowDeposit();
  // await giveBalMinterPermission();
  // await runGaugeSetup();
  // await addMainPoolGaugeSetup();
  // await createConfigPoolGauges()
  //
  await doPools();
  //  await doMainJoin();
  //
  // const mainPool = await getMainPoolConfig();
  // await createMainPool();
  // await authorizeToPauseWeightedPool(mainPool.poolAddress);
  // await initWeightedJoin(
  //   mainPool.poolId,
  //   mainPool.deploymentArgs.tokens,
  //   mainPool.deploymentArgs.initialBalances,
  //   await getSignerAddress(),
  // );
  // const instance = await getWeightedPoolToken(mainPool.poolAddress);
  // const action = await instance.getActionId(getSighash(instance, 'pause'));
  // await grantVaultAuthorizerPermissions([action], [instance.address]);
  // await awaitTransactionComplete(instance.pause());
  // await testVeStakeFor();
}

async function doPools() {
  const idx = 1;

  //  await createConfigWeightedPool(idx);
  const pool = await getPoolConfig(idx);
  await initWeightedJoin(
    pool.poolId,
    pool.deploymentArgs.tokens,
    pool.deploymentArgs.initialBalances,
    await getSignerAddress(),
  );
}

async function doMainJoin() {
  const pool = await getMainPoolConfig();
  const vault = await getVault();

  const poolInfo = await vault.getPoolTokens(pool.poolId);
  console.log(poolInfo.balances.map((b) => formatEther(b)));

  // const idk = calcBptOutGivenExactTokensIn()

  // const instance = await getWeightedPoolToken(pool.poolAddress);

  // await doPoolJoin()
}

async function testVeStakeFor() {
  const niceTestAddy = '0x1555D126e096A296A5870A566db224FD9Cf72f03';
  await stakeForUser(niceTestAddy, parseEther('1'), 30);
}

async function testGaugeRewardDeposits() {
  const vrtkAddy = '0xa5694789C0BaED77d16ca36edC45C9366DBFe0A9';
  const ashareGauge = '0x53c5B5C391FD8d7f538fb6Ac6E50Ec47e0680CE0';
  const amesGauge = '0xa64DE16c3D674F4F56aa5b8978eCeb4C2Cceb7A9';
  const vrtkBusdGauge = '0xdcae01e5f3103178Cf06EB3037c9b8E5FA9FD848';

  await addRewardTokenToGauge(ashareGauge, vrtkAddy);
  await doGaugeRewardTokenDeposit(ashareGauge, vrtkAddy, parseEther('100'));
}

run();
