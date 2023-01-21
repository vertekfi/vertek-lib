import { calcOutGivenIn } from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  activateTokenAdmin,
  approveTokenAdminActivation,
  initBaseAuthSetup,
  updateVaultAuthorizer,
} from './services/deployment';
import {
  completeWeightedSetup,
  createConfigWeightedPool,
} from './services/pools/pool-creation';
import { getAddress } from '@ethersproject/address';
import { getVault } from './utils/contract.utils';
import { getPoolId } from './services/pools/pool.utils';
import { runPoolsSetup } from './services/pools/pools';

async function run() {
  config({ path: join(process.cwd(), '.env') });
  // console.log(calcOutGivenIn(2.4, 0.8, 2, 0.2, 1));
  // const vault = await getVault();

  await initBaseAuthSetup();
  // await runPoolsSetup();
}

run();
