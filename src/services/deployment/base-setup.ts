import { Contract } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import * as moment from 'moment-timezone';
import { getSigner, getSignerAddress } from 'src/utils/account.util';
import { ZERO_BYTES32 } from 'src/utils/constants';
import {
  getBalMinter,
  getContractAddress,
  getERC20,
  getGovToken,
  getSighash,
  getTimelockAuthorizer,
  getTokenAddress,
  getTokenAdmin,
  getVault,
  getVotingEscrow,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { performAuthEntrypointAction } from '../auth/auth';
import { doInitialVotingEscrowDeposit } from '../gauges/voting-escrow';
import { getMainPoolConfig } from '../pools/pool.utils';

/**
 * Items core to base system setup. (Vault authorizer switch, TokenAdmin, Minter, etc)
 */
export async function initBaseAuthSetup() {
  // await updateVaultAuthorizer();
  // await approveTokenAdminActivation();
  // await activateTokenAdmin();
  // await giveBalMinterPermission();
  // await doInitialVotingEscrowDeposit();
}

/**
 * This setup is required as part of how the Vault authorizer is set at deployment time now.
 * Due to a circular dependency between auth contracts created through a bug fix.
 */
export async function updateVaultAuthorizer() {
  const vault = await getVault();

  const dummy = new Contract(
    getContractAddress('MockAuthorizer'),
    ['function grantRolesToMany(bytes32[], address[]) public'],
    await getSigner(),
  );

  const vaultId = await vault.getActionId(getSighash(vault, 'setAuthorizer'));

  await awaitTransactionComplete(
    dummy.grantRolesToMany([vaultId], [await getSignerAddress()]),
  );

  await awaitTransactionComplete(
    vault.setAuthorizer(getContractAddress('TimelockAuthorizer')),
  );
}

/**
 * Perform authorization sreps needed to setup BalancerTokenAdmin.
 * BalancerTokenAdmin takes over full auth control of the protocol token (BAL/VRTK).
 */
export async function setupTokenAdminBeforeActivation() {
  logger.info('setupTokenAdminBeforeActivation:');

  const tokenAdmin = await getTokenAdmin();
  const actionId = await tokenAdmin.getActionId(
    getSighash(tokenAdmin, 'activate'),
  );

  const authorizer = await getTimelockAuthorizer();
  await awaitTransactionComplete(
    authorizer.grantPermissions([actionId], (await getSigner()).address, [
      tokenAdmin.address,
    ]),
  );

  const govToken = await getGovToken();
  await awaitTransactionComplete(
    govToken.grantRole(ZERO_BYTES32, tokenAdmin.address),
  );

  logger.success('BalancerTokenAdmin setup complete');
}

/**
 * Authorization steps should have already been completed.
 * This is so the setup and then activation step can happen at different times.
 */
export async function activateTokenAdmin() {
  const tokenAdmin = await getTokenAdmin();
  await awaitTransactionComplete(tokenAdmin.activate());

  // The initial mint allowance should be transferred to admin caller account
  const vrtk = await getERC20(getTokenAddress('VRTK'));
  logger.info(
    `Dev account VRTK balance after activation: ${formatEther(
      await vrtk.balanceOf(await getSignerAddress()),
    )}`,
  );
}

export async function grantProtocolFeesPercentageItems() {
  // TODO:
}

export async function giveBalMinterPermission() {
  const tokenAdmin = await getTokenAdmin();
  const actionId = await tokenAdmin.getActionId(getSighash(tokenAdmin, 'mint'));

  const minter = await getBalMinter();
  const authorizer = await getTimelockAuthorizer();
  await awaitTransactionComplete(
    authorizer.grantPermissions([actionId], minter.address, [
      tokenAdmin.address,
    ]),
  );
}
