import { Contract } from 'ethers';
import { getSigner, getSignerAddress } from 'src/utils/account.util';
import { ZERO_BYTES32 } from 'src/utils/constants';
import {
  getAuthAdapterEntrypoint,
  getAuthorizerAdapter,
  getContractAddress,
  getGovToken,
  getSighash,
  getTimelockAuthorizer,
  getTokenAdmin,
  getVault,
} from 'src/utils/contract.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { performAuthEntrypointAction } from './auth';

export async function updateVaultAuthorizer() {
  const vault = await getVault();

  const vaultId = await vault.getActionId(getSighash(vault, 'setAuthorizer'));
  const dummy = new Contract(
    getContractAddress('MockAuthorizer'),
    [
      'function grantRolesToMany(bytes32[], address[]) public',
      'function DEFAULT_ADMIN_ROLE() public view returns (address)',
      'function getRoleAdmin(bytes32 role) external view returns (bytes32)',
      'function getRoleMemberCount(bytes32 role) external view returns (uint256)',
      'function getRoleMember(bytes32 role, uint256 index) external view returns (address)',
    ],
    await getSigner(),
  );

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
