import {
  getAllPoolsWithGauges,
  getLiquidityGaugeInstance,
} from 'src/utils/contract.utils';
import { doTransaction, sleep } from 'src/utils/transaction.utils';
import { performAuthEntrypointAction } from '../../auth/auth';

export class FeeManagementAutomation {
  constructor() {}

  async getPendingFeeTokens() {
    // subgraph all tokens and get distributors balances
    // V2 is BPT, so really just all pools
  }

  async withdrawGaugeFees() {
    const pools = await getAllPoolsWithGauges();
    for (const pool of pools) {
      const g = await getLiquidityGaugeInstance(pool.gauge.address);
      await performAuthEntrypointAction(g, 'withdrawFees');
      await sleep(1000);
    }
  }

  // Break LP to "extract" the tokens
  async withdrawPoolTokenLiquidity() {
    //
  }
}
