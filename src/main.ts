import { calcInGivenOut, calcOutGivenIn } from './math';
import { config } from 'dotenv';
import { join } from 'path';
import {
  activateTokenAdmin,
  approveTokenAdminActivation,
  initBaseAuthSetup,
  updateVaultAuthorizer,
} from './services/deployment/base-setup';
import {
  completeWeightedSetup,
  createConfigWeightedPool,
  createMainPool,
} from './services/pools/pool-creation';
import { getAddress } from '@ethersproject/address';
import {
  getAuthorizerAdapter,
  getERC20,
  getLiquidityGaugeInstance,
  getSighash,
  getVault,
  getVotingEscrow,
} from './utils/contract.utils';
import { getPoolId } from './services/pools/pool.utils';
import { runPoolsSetup } from './services/pools/pools';
import { runGaugeSetup } from './services/deployment/gauges-setup';
import {
  addRewardTokenToGauge,
  deGaugeRewardTokenDeposit,
  doGaugeDeposit,
} from './services/gauges/gauge-utils';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import { stakeForUser } from './services/gauges/voting-escrow';
import * as moment from 'moment-timezone';

async function run() {
  console.log('VertekFi run:');
  config({ path: join(process.cwd(), '.env') });

  // BNB@~$310 vrtk@$7 = 0.0225806452 BNB -> 1 VRTK ---- RATIO 180 TO 1 (VRTK -> BNB)
  // 10 BNB = $3,100, Need then 1800 VRTK = $12,600 ($15,700 initial liquidity value)
  // console.log(calcOutGivenIn(175, 0.8, 1, 0.2, 1));
  // console.log(calcInGivenOut(1, 0.2, 180, 0.8, 1));

  await createMainPool('0xa5694789C0BaED77d16ca36edC45C9366DBFe0A9');
}

async function setupBSC() {
  // await updateVaultAuthorizer(); '✅'
}

async function testVeStakeFor() {
  const niceTestAddy = '0x1555D126e096A296A5870A566db224FD9Cf72f03';
  await stakeForUser(niceTestAddy, parseEther('10'), 30);
}

async function testGaugeRewardDeposits() {
  const vrtkAddy = '0xa5694789C0BaED77d16ca36edC45C9366DBFe0A9';
  const ashareGauge = '0x53c5B5C391FD8d7f538fb6Ac6E50Ec47e0680CE0';
  const amesGauge = '0xa64DE16c3D674F4F56aa5b8978eCeb4C2Cceb7A9';
  const vrtkBusdGauge = '0xdcae01e5f3103178Cf06EB3037c9b8E5FA9FD848';

  await addRewardTokenToGauge(ashareGauge, vrtkAddy);
  await deGaugeRewardTokenDeposit(ashareGauge, vrtkAddy, parseEther('100'));
}

run();
