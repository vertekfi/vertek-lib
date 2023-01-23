import { calcOutGivenIn } from './math';
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
} from './services/pools/pool-creation';
import { getAddress } from '@ethersproject/address';
import {
  getAuthorizerAdapter,
  getERC20,
  getLiquidityGaugeInstance,
  getSighash,
  getVault,
} from './utils/contract.utils';
import { getPoolId } from './services/pools/pool.utils';
import { runPoolsSetup } from './services/pools/pools';
import { runGaugeSetup } from './services/deployment/gauges-setup';
import {
  addRewardToGauge,
  depositRewardToGauge,
  doGaugeDeposit,
} from './services/gauges/gauge-utils';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { getSignerAddress } from './utils/account.util';
import { awaitTransactionComplete } from './utils/transaction.utils';
import { doInitialVotingEscrowDeposit } from './services/gauges/voting-escrow';

async function run() {
  console.log('vertekfi run:');
  config({ path: join(process.cwd(), '.env') });
  //  console.log(calcOutGivenIn(17000, 0.8, 30000, 0.2, 1));
  // const vault = await getVault();
  // await initBaseAuthSetup();
  // await runPoolsSetup();
  // await runGaugeSetup();

  const tokenAddy = '0xa5694789C0BaED77d16ca36edC45C9366DBFe0A9';
  const gauge = '0x53c5B5C391FD8d7f538fb6Ac6E50Ec47e0680CE0';

  // const instance = await getLiquidityGaugeInstance(gauge);
  // const adapter = await getAuthorizerAdapter();
  // const id = await adapter.getActionId(
  //   getSighash(instance, 'deposit_reward_token'),
  // );
  // console.log(id);
  // to address to 0x2cE9d3246dd0F98b0B6C5754e55E8d81C5b30Ce2 entrypoint for ddeposit_reward_token fails with #430 low level call failed
  // hmmm...
  // I deposited to create a balance. What is the
  //
  // await doInitialVotingEscrowDeposit();
  //
  // await addRewardToGauge(
  //   gauge,
  //   tokenAddy,
  // );

  // const token = await getERC20(tokenAddy);
  // console.log(formatEther(await token.balanceOf(gauge)));

  // await depositRewardToGauge(gauge, tokenAddy, parseEther('1000'));

  // await doGaugeDeposit(gauge, parseEther('10'));
}

run();
