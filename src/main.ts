import {
  calcBptOutGivenExactTokensIn,
  calcInGivenOut,
  calcOutGivenIn,
} from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  createConfigWeightedPool,
  doPoolInitJoin,
} from './services/pools/pool-creation';
import {
  addLiquidityGaugeToController,
  addRewardTokenToGauge,
  createLiquidityGauge,
  doGaugeRewardTokenDeposit,
  GaugeFeeType,
  setGaugeFees,
  updateGaugeFee,
} from './services/gauges/gauge-utils';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { stakeForUser } from './services/gauges/voting-escrow';
import {
  getContractAddress,
  getGaugeController,
  getLiquidityGaugeFactory,
  getSighash,
  getTimelockAuthorizer,
  getVault,
  getVotingEscrow,
  getWeightedPoolToken,
} from './utils/contract.utils';
import {
  getAllPoolConfigs,
  getMainPoolConfig,
  getPoolConfig,
  initWeightedJoin,
  updatePoolConfig,
} from './services/pools/pool.utils';
import {
  getBlockTimeStamp,
  getChainProvider,
  getDefaultChainProvider,
  getSigner,
  getSignerAddress,
} from './utils/account.util';
import { GaugeTypeNum } from './types/gauge.types';
import { awaitTransactionComplete } from './utils/transaction.utils';
import {
  grantVaultAuthorizerPermissions,
  performAuthEntrypointAction,
} from './services/auth/auth';
import { Contract } from '@ethersproject/contracts';
import * as moment from 'moment-timezone';
import { ANY_ADDRESS, ZERO_ADDRESS } from './utils/constants';

config({ path: join(process.cwd(), '.env') });

async function run() {
  console.log('VertekFi run:');

  // const balanceIn = 1.4;
  // const weightIn = 0.7;
  // const balanceOut = 3;
  // const weightOut = 0.3;

  // const amountIn = 1;

  // const out = calcOutGivenIn(
  //   balanceIn,
  //   weightIn,
  //   balanceOut,
  //   weightOut,
  //   amountIn,
  // );
  // console.log(out);
  // console.log(out.mul(300));

  // await doPools();

  // const idx = 5;
  // const pool = await getPoolConfig(idx);
  // console.log(pool);
  // await createConfigWeightedPool(idx);
  // await doPoolInitJoin(pool);

  // const fml = await getWeightedPoolToken(
  //   '0x6F1A24488736D0A45D5Cb9079bC3Ce328B9C8254',
  // );
  // console.log(await fml.getPoolId());

  // const factory = new Contract(
  //   getContractAddress('WeightedPoolFactory'),
  //   [
  //     `function create(
  //     string  name,
  //     string  symbol,
  //     address[]  tokens,
  //     uint256[]  normalizedWeights,
  //     address[]  rateProviders,
  //     uint256 swapFeePercentage,
  //     address owner
  // ) external returns (address) `,
  //   ],
  //   await getSigner(),
  // );

  // const tokens = [
  //   '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  //   '0x6640e6f8e3DD1Fb5D7361ee2249E1ea23cB2C297',
  // ];

  // console.log(
  //   tokens.sort((a1, a2) => (a1.toLowerCase() < a2.toLowerCase() ? -1 : 1)),
  // );

  // const weights = [parseUnits('0.3'), parseUnits('0.7')];
  // const providers = [ZERO_ADDRESS, ZERO_ADDRESS];
  // const swapFeePercentage = parseEther('0.01');
  // const initialBalances = ['0.001', '0.00233'];

  // const receipt = await awaitTransactionComplete(
  //   factory.create(
  //     'Pure Serenity',
  //     '70SRN-30ETH',
  //     tokens,
  //     weights,
  //     providers,
  //     swapFeePercentage,
  //     await getSignerAddress(),
  //   ),
  // );
  // const poolAddress = receipt.events[0].address;
  // console.log('poolAddress: ' + poolAddress);
  // const poolId = receipt.events[1].topics[1];
  // console.log('poolId: ' + poolId);

  // await initWeightedJoin(
  //   '',
  //   tokens,
  //   initialBalances,
  //   await getSignerAddress(),
  // );

  // const p = await getWeightedPoolToken(
  //   '',
  // );
  // await awaitTransactionComplete(p.pause());
  // await awaitTransactionComplete(p.unpause());
  // await awaitTransactionComplete(p.setSwapFeePercentage(swapFeePercentage));
  // const id = await p.getActionId(getSighash(p, 'unpause'));
  // await grantVaultAuthorizerPermissions(
  //   [await p.getActionId(getSighash(p, 'unpause'))],
  //   [ANY_ADDRESS],
  // );

  const factory = await getLiquidityGaugeFactory();
  const receipt = await awaitTransactionComplete(
    factory.create('0x25b7DcDCCAaB62F4cacEf8BC9ae20553eB1d9164', 0),
  );

  const gaugeAddress = receipt.events[0].args.gauge;
  console.log('gauge: ' + gaugeAddress);

  const gaugeController = await getGaugeController();
  await performAuthEntrypointAction(gaugeController, 'add_gauge', [
    gaugeAddress,
    GaugeTypeNum.Ethereum,
    0,
  ]);

  // await updateGaugeFee('', GaugeFeeType.Deposit, 100)
  // await updateGaugeFee('', GaugeFeeType.Withdraw, 100)
}

async function doStable() {
  //
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
