import { calcOutGivenIn } from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  activateTokenAdmin,
  approveTokenAdminActivation,
  updateVaultAuthorizer,
} from './services/deployment';
import {
  completeWeightedSetup,
  createConfigWeightedPool,
} from './services/pools/pool-creation';
import { getAddress } from '@ethersproject/address';
import { getVault } from './utils/contract.utils';

async function bootstrap() {
  config({ path: join(process.cwd(), '.env') });
  // console.log(calcOutGivenIn(2.4, 0.8, 2, 0.2, 1));

  //  await createConfigWeightedPool(0);
  //await completeWeightedSetup('0x81b91aB36FCc6522a55DE00718c0fcfd5e8D5D75');
  await updateVaultAuthorizer();
  // await approveTokenAdminActivation();
  // await activateTokenAdmin();
}

bootstrap();
