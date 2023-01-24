import { Contract } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import * as moment from 'moment-timezone';
import { getSigner, getSignerAddress } from 'src/utils/account.util';
import { ZERO_BYTES32 } from 'src/utils/constants';
import {
  getBalMinter,
  getContractAddress,
  getGovToken,
  getSighash,
  getTimelockAuthorizer,
  getTokenAdmin,
  getVault,
  getVotingEscrow,
} from 'src/utils/contract.utils';
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
 * This setup is required as part of how the Vault authorizer is set
 * at deployment time now. Do to a circular dependency between auth contracts.
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

export async function approveTokenAdminActivation() {
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

  await awaitTransactionComplete(tokenAdmin.activate());
}

export async function activateTokenAdmin() {
  const tokenAdmin = await getTokenAdmin();
  await performAuthEntrypointAction(tokenAdmin, 'activate');
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
