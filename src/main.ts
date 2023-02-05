import {
  calcBptOutGivenExactTokensIn,
  calcInGivenOut,
  calcOutGivenIn,
} from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  addLiquidityGaugeToController,
  addRewardTokenToGauge,
  checkpointAllGauges,
  createLiquidityGauge,
  doGaugeRewardTokenDeposit,
  getAllGaugePendingProtocolFees,
} from './services/gauges/gauge-utils';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { stakeForUser } from './services/gauges/voting-escrow';
import {
  getGaugeController,
  getLiquidityGaugeInstance,
  getVault,
  getWeightedPoolToken,
} from './utils/contract.utils';
import {
  getMainPoolConfig,
  getPoolAddress,
  getPoolConfig,
  initWeightedJoin,
} from './services/pools/pool.utils';
import { doTransaction } from './utils/transaction.utils';
import {
  checkpointController,
  checkpointGauge,
} from './services/automation/gauges';
import { subgraphService } from './services/subgraphs/subgraph-client';
import * as moment from 'moment-timezone';
import { performAuthEntrypointAction } from './services/auth/auth';
import { createConfigWeightedPool } from './services/pools/pool-creation';
import { getSignerAddress } from './utils/account.util';
import { GaugeTypeNum } from './types/gauge.types';

config({ path: join(process.cwd(), '.env') });

function sort(addies: string[]) {
  return addies.sort((a1, a2) =>
    a1.toLowerCase() < a2.toLowerCase() ? -1 : 1,
  );
}

async function run() {
  console.log('VertekFi run:');

  // const out = calcOutGivenIn(21.6, 0.6, 0.01455, 0.2, 1);
  // console.log(out);
}

run();
