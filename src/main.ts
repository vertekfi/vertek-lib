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
  getVotingEscrow,
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
import { getSigner, getSignerAddress } from './utils/account.util';
import { awaitTransactionComplete } from './utils/transaction.utils';
import { doInitialVotingEscrowDeposit } from './services/gauges/voting-escrow';

import { subgraphsClient } from './services/subgraphs/subgraph-client';
import { gql } from 'graphql-request';
import { doVeAeqSnapshot } from './data/vertek/snapshots/veAEQ/veAEQ-snapshot';

async function run() {
  console.log('vertekfi run:');
  config({ path: join(process.cwd(), '.env') });
  // console.log(calcOutGivenIn(17000, 0.8, 30000, 0.2, 1));
  // const vault = await getVault();
  // await initBaseAuthSetup();
  // await runPoolsSetup();
  // await runGaugeSetup();

  const tokenAddy = '0xa5694789C0BaED77d16ca36edC45C9366DBFe0A9';
  const gauge = '0x53c5B5C391FD8d7f538fb6Ac6E50Ec47e0680CE0';

  // await doInitialVotingEscrowDeposit();

  // await doVeAeqSnapshot();
}

run();
