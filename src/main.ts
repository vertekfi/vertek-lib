import {
  calcBptOutGivenExactTokensIn,
  calcInGivenOut,
  calcOutGivenIn,
} from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  addRewardTokenToGauge,
  doGaugeRewardTokenDeposit,
} from './services/gauges/gauge-utils';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { stakeForUser } from './services/gauges/voting-escrow';
import { getVault } from './utils/contract.utils';
import { getMainPoolConfig } from './services/pools/pool.utils';

config({ path: join(process.cwd(), '.env') });

function sort(addies: string[]) {
  return addies.sort((a1, a2) =>
    a1.toLowerCase() < a2.toLowerCase() ? -1 : 1,
  );
}

async function run() {
  console.log('VertekFi run:');
  // const pools = await getAllPoolConfigs();
  // for (const pool of pools) {
  //   const p = await getWeightedPoolToken(pool.poolAddress);
  //   if (pool.type == 'Stable') {
  //     await doTransaction(p.pause());
  //   }
  // }

  // const pool = await getWeightedPoolToken(
  //   '',
  // );
  //await doTransaction(pool.unpause());
  //await doTransaction(pool.pause());
  // await doTransaction(pool.setSwapFeePercentage(parseUnits('0.005')));
  //
  // const mainToken = '0xeD236c32f695c83Efde232c288701d6f9C23E60E';
  // const poolId =
  //   '0xdd64e2ec144571b4320f7bfb14a56b2b2cbf37ad000200000000000000000000';
  // const tokens = sort([
  //   '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  //   mainToken,
  // ]);

  // const assetInIndex = tokens[0] == mainToken ? 0 : 1;
  // const assetOutIndex = assetInIndex === 0 ? 1 : 0;
  // const amountIn = parseEther('1');

  // const me = await getSignerAddress();
  // const batchStep = [
  //   {
  //     poolId,
  //     assetInIndex,
  //     assetOutIndex,
  //     amount: amountIn,
  //     userData: '0x',
  //   },
  // ];
  // const fundManagement = {
  //   sender: me,
  //   fromInternalBalance: false,
  //   recipient: me,
  //   toInternalBalance: false,
  // };
  // const vault = await getVault();
  // const deltas = await vault.callStatic.queryBatchSwap(
  //   SwapKind.GIVEN_IN,
  //   batchStep,
  //   tokens,
  //   fundManagement,
  // );
  // console.log(deltas.map((d) => formatEther(d)));

  // const balanceIn = 100;
  // const weightIn = 0.8;
  // const balanceOut = 0.001;
  // const weightOut = 0.2;

  // const amountIn = 1;

  // const out = calcOutGivenIn(
  //   balanceIn,
  //   weightIn,
  //   balanceOut,
  //   weightOut,
  //   amountIn,
  // );
  // console.log(out);
  // // console.log(out.mul(300));
  // const gauge = await getLiquidityGaugeInstance(
  //   '',
  // ); // ashare

  // const acct = await getSignerAddress();

  // await approveTokensIfNeeded(
  //   [''],
  //   acct,
  //   gauge.address,
  // );
  // await awaitTransactionComplete(gauge.deposit(await gauge.balanceOf(acct)));
  // await doPools();

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
  //   '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
  //   '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  // ];

  // console.log(
  //   tokens.sort((a1, a2) => (a1.toLowerCase() < a2.toLowerCase() ? -1 : 1)),
  // );

  // const weights = [
  //   parseUnits('0.3334'),
  //   parseUnits('0.3333'),
  //   parseUnits('0.3333'),
  // ];
  // const providers = [ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS];
  // const swapFeePercentage = parseEther('0.003');
  // const initialBalances = ['0.00311149', '0.000216016', '0.0161202'];

  // const receipt = await awaitTransactionComplete(
  //   factory.create(
  //     'Blue Chip Buffet',
  //     '33ETH-33BTCB-33BNB',
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

  // const poolAddress = '';
  // const factory2 = await getLiquidityGaugeFactory();
  // const receipt2 = await awaitTransactionComplete(
  //   factory2.create(poolAddress, 0),
  // );
  // const gaugeAddress = receipt2.events[0].args.gauge;
  // console.log('gauge: ' + gaugeAddress);

  // const gaugeAddress = '';
  // const gaugeController = await getGaugeController();
  // await performAuthEntrypointAction(gaugeController, 'add_gauge', [
  //   gaugeAddress,
  //   GaugeTypeNum.Ethereum,
  //   0,
  // ]);

  // await updateGaugeFee(gaugeAddress, GaugeFeeType.Deposit, 100);
  // await updateGaugeFee(gaugeAddress, GaugeFeeType.Withdraw, 100);

  // const p = await getWeightedPoolToken(
  //   '',
  // );
  // await awaitTransactionComplete(p.pause());
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
