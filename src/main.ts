import {
  calcBptOutGivenExactTokensIn,
  calcInGivenOut,
  calcOutGivenIn,
} from './math';
import { config } from 'dotenv';
import { join } from 'path';
import { createConfigWeightedPool } from './services/pools/pool-creation';
import {
  addLiquidityGaugeToController,
  addRewardTokenToGauge,
  createLiquidityGauge,
  doGaugeRewardTokenDeposit,
  setGaugeFees,
} from './services/gauges/gauge-utils';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { stakeForUser } from './services/gauges/voting-escrow';
import {
  getSighash,
  getTimelockAuthorizer,
  getVault,
  getWeightedPoolToken,
} from './utils/contract.utils';
import {
  getAllPoolConfigs,
  getMainPoolConfig,
  getPoolConfig,
  initWeightedJoin,
  updatePoolConfig,
} from './services/pools/pool.utils';
import { getSignerAddress } from './utils/account.util';
import { GaugeTypeNum } from './types/gauge.types';
import { awaitTransactionComplete } from './utils/transaction.utils';
import { grantVaultAuthorizerPermissions } from './services/auth/auth';

config({ path: join(process.cwd(), '.env') });

async function run() {
  console.log('VertekFi run:');

  // const amountIn = 1;
  // const balanceIn = 1;
  // const weightIn = 0.7;
  // const balanceOut = 6.25;
  // const weightOut = 0.3;
  // console.log(
  //   calcOutGivenIn(balanceIn, weightIn, balanceOut, weightOut, amountIn),
  // );
  //
  // await doPools();
}

async function doPools() {
  // const idx = 5;
  // const pool = await getPoolConfig(idx);
  // await initWeightedJoin(
  //   pool.poolId,
  //   pool.deploymentArgs.tokens,
  //   pool.deploymentArgs.initialBalances,
  //   await getSignerAddress(),
  // );
  // pool.initJoinComplete = true;
  // await updatePoolConfig(pool);
  // await createLiquidityGauge(pool);
  // await addLiquidityGaugeToController(pool, GaugeTypeNum.Ethereum);
  // await setGaugeFees(pool);
  // const pool = await getMainPoolConfig();
  // const instance = await getWeightedPoolToken(pool.poolAddress);
  // const pool = await getPoolConfig(4);
  // const ids = [];
  // const addies = [];
  // const instance = await getWeightedPoolToken(pool.poolAddress);
  // const pa = await instance.getActionId(getSighash(instance, 'pause'));
  // const up = await instance.getActionId(getSighash(instance, 'unpause'));
  // ids.push(pa);
  // ids.push(up);
  // addies.push(pool.poolAddress);
  // addies.push(pool.poolAddress);
  // await grantVaultAuthorizerPermissions(ids, addies);
  // await awaitTransactionComplete(instance.pause());
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
  //  await doMainJoin();
  //
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
