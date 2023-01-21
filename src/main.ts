import { calcOutGivenIn } from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  activateTokenAdmin,
  approveTokenAdminActivation,
  updateVaultAuthorizer,
} from './services/deployment';
import { createConfigWeightedPool } from './services/pools/pool-creation';

async function bootstrap() {
  config({ path: join(process.cwd(), '.env') });
  // console.log(calcOutGivenIn(2.4, 0.8, 2, 0.2, 1));

  await createConfigWeightedPool(0);
  // await updateVaultAuthorizer();
  // await approveTokenAdminActivation();
  // await activateTokenAdmin();
}

bootstrap();
