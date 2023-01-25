import { BigNumber, ContractReceipt } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import * as moment from 'moment';
import { getSignerAddress } from 'src/utils/account.util';
import { getVotingEscrow } from 'src/utils/contract.utils';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { getMainPoolConfig } from '../pools/pool.utils';

import * as fs from 'fs-extra';
import { join } from 'path';
import { performAuthEntrypointAction } from '../auth/auth';
import { logger } from 'src/utils/logger';

export enum VotingEscrowStakeType {
  CREATE = 'CREATE',
  INCREASE_AMOUNT = 'INCREASE_AMOUNT',
  INCREASE_TOTAL_STAKE = 'INCREASE_TOTAL_STAKE',
}

export interface EscrowStakeForInfo {
  txHash: string;
  amount: string;
  who: string;
  endTimestamp: number;
  type: VotingEscrowStakeType;
}

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

/**
 * Permissioned call. Authorization should already have been given.
 * The account calling this will need to set as the "staking admin" in the contract.
 * As well as have the `amount` in their account at call time.
 * @param who
 * @param amount
 * @param endTimeDaysFromNow  The number of days from now the lock should end.
 */
export async function stakeForUser(
  who: string,
  amount: BigNumber,
  endTimeDaysFromNow: number,
) {
  const mainPool = await getMainPoolConfig();
  const votingEsrow = await getVotingEscrow();

  // Could add certain checks here and account for contracts rounding of time to weeks, etc
  // But the way this is used right now is more of a manual interactive process anyway
  const unlockTime = moment()
    .add(endTimeDaysFromNow, 'days')
    .endOf('day')
    .utc()
    .unix();

  await approveTokensIfNeeded(
    [mainPool.poolAddress],
    await getSignerAddress(),
    votingEsrow.address,
  );

  const receipt = await performAuthEntrypointAction(
    votingEsrow,
    'admin_create_lock_for',
    [who, amount, unlockTime],
  );

  logger.success(
    'Stake for user balance: ' +
      formatEther(await votingEsrow['balanceOf(address)'](who)),
  );

  await saveStake(
    who,
    amount,
    unlockTime,
    VotingEscrowStakeType.CREATE,
    receipt,
  );
}

export async function increaseStakeForUser() {
  //
}

export async function increaseTotalStakeForUser() {
  //
}

async function saveStake(
  who: string,
  amount: BigNumber,
  endTimestamp: number,
  type: VotingEscrowStakeType,
  receipt: ContractReceipt,
) {
  const dataPath = join(
    process.cwd(),
    'src/data/vertek/ve-stakes/ve-stakes.json',
  );

  const stakes: EscrowStakeForInfo[] = await fs.readJSON(dataPath);
  stakes.push({
    who,
    amount: formatEther(amount),
    endTimestamp,
    type,
    txHash: receipt.transactionHash,
  });

  await fs.writeJson(dataPath, stakes);
}
