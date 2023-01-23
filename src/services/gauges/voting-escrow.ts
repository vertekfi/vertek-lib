import { parseEther } from 'ethers/lib/utils';
import moment from 'moment';
import { getSignerAddress } from 'src/utils/account.util';
import { getVotingEscrow } from 'src/utils/contract.utils';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { getMainPoolConfig } from '../pools/pool.utils';

/**
 *  FeeDistributor needs ve total supply > 0 if start time is the current week/epoch
 * @returns
 */
export async function doInitialVotingEscrowDeposit() {
  const votingEsrow = await getVotingEscrow();
  const mainPool = await getMainPoolConfig();
  await approveTokensIfNeeded(
    [mainPool.poolAddress],
    await getSignerAddress(),
    votingEsrow.address,
  );
  return await awaitTransactionComplete(
    votingEsrow.create_lock(parseEther('1'), moment().add(14, 'days').unix()),
  );
}

export async function stakeForUser() {
  //
}

export async function increaseStakeForUser() {
  //
}

export async function increaseTotalStakeForUser() {
  //
}
