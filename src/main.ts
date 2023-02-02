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
}

run();
