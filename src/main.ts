import { calcInGivenOut, calcOutGivenIn } from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  activateTokenAdmin,
  initBaseAuthSetup,
  setupTokenAdminBeforeActivation,
  updateVaultAuthorizer,
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
  getTokenAddress,
  getTokenAdmin,
} from './utils/contract.utils';
import { getMainPoolConfig, getPoolConfig } from './services/pools/pool.utils';
import {
  doAuthVotinEscrowActionItems,
  initGaugeAuthItems,
} from './services/deployment/gauge-auth-setup';
import { GaugeTypeNum } from './types/gauge.types';

async function run() {
  console.log('VertekFi run:');
  config({ path: join(process.cwd(), '.env') });

  // BNB@~$310 vrtk@$7 = 0.0225806452 BNB -> 1 VRTK ---- RATIO 180 TO 1 (VRTK -> BNB)
  // 10 BNB = $3,100, Need then 1800 VRTK = $12,600 ($15,700 initial liquidity value)
  // console.log(calcOutGivenIn(7000, 0.8, 2000, 0.2, 1));
  // console.log(calcInGivenOut(1, 0.2, 180, 0.8, 1));

  await setupForNetwork();
}

async function setupForNetwork() {
  // await updateVaultAuthorizer(); // GOERLI -> '✅', BSC -> '✅'
  // await setupTokenAdminBeforeActivation(); // GOERLI -> '✅'
  // await activateTokenAdmin(); // GOERLI -> '✅'
  // await initGaugeAuthItems() // GOERLI -> '✅'
  // await createMainPool(getTokenAddress('VRTK')); // GOERLI -> '✅'
  // await doPoolInitJoin(await getMainPoolConfig()); // GOERLI -> '✅'
  // await doAuthVotinEscrowActionItems(); // GOERLI -> '✅'
  // await doInitialVotingEscrowDeposit(); // GOERLI -> '✅'
  // await createConfigWeightedPool(1); // GOERLI -> '✅'
  // await createConfigWeightedPool(2); // GOERLI -> '✅'
  // let pool = await getPoolConfig(1);; // GOERLI -> '✅'
  // await doPoolInitJoin(pool);; // GOERLI -> '✅'
  // let pool = await getPoolConfig(2);; // GOERLI -> '✅'
  // await doPoolInitJoin(pool);; // GOERLI -> '✅'
  // await runGaugeSetup();
  // await addMainPoolGaugeSetup(); // GOERLI -> '✅'
  // await createConfigPoolGauges() // GOERLI -> '✅'
}

async function testVeStakeFor() {
  const niceTestAddy = '0x1555D126e096A296A5870A566db224FD9Cf72f03';
  await stakeForUser(niceTestAddy, parseEther('1'), 365);
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
