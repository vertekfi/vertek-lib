import { Contract } from 'ethers';
import { getSigner, getSignerAddress } from 'src/utils/account.util';
import { ZERO_BYTES32 } from 'src/utils/constants';
import {
  getAuthAdapterEntrypoint,
  getAuthorizerAdapter,
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

  const fml = new Contract(
    '0x7Ba299187FD38111D567964d4577EfF932f0E41A',
    [
      'function grantRolesToMany(bytes32[], address[]) public',
      'function DEFAULT_ADMIN_ROLE() public view returns (address)',
      'function getRoleAdmin(bytes32 role) external view returns (bytes32)',
      'function getRoleMemberCount(bytes32 role) external view returns (uint256)',
      'function getRoleMember(bytes32 role, uint256 index) external view returns (address)',
    ],
    await getSigner(),
  );

  console.log(await fml.getRoleMember(ZERO_BYTES32, 0));

  // await awaitTransactionComplete(
  //   fml.grantRolesToMany([vaultId], [await getSignerAddress()]),
  // );

  // "MockBasicAuthorizer": "0x7Ba299187FD38111D567964d4577EfF932f0E41A",
  // "Vault": "0x1F56FDcB9E3a818E4BB2E6Fe2cb73F7385D3Aeac",
  // "ProtocolFeesCollector": "0xd8b1182B67cC615F0295843f52AA4E9DBdB319B0"
}

export async function approveTokenAdminActivation() {
  const tokenAdmin = await getTokenAdmin();
  // const adapter = await getAuthorizerAdapter();
  // const actionId = await tokenAdmin.getActionId(
  //   getSighash(tokenAdmin, 'activate'),
  // );

  // const authorizer = await getTimelockAuthorizer();
  // await awaitTransactionComplete(
  //   authorizer.grantPermissions([actionId], (await getSigner()).address, [
  //     tokenAdmin.address,
  //   ]),
  //   3,
  // );

  // const adaptorEntrypoint = await getAuthAdapterEntrypoint();
  // const calldata = tokenAdmin.interface.encodeFunctionData('activate');
  // await awaitTransactionComplete(
  //   adaptorEntrypoint.performAction(tokenAdmin.address, calldata),
  // );
}

export async function activateTokenAdmin() {
  const tokenAdmin = await getTokenAdmin();
  await performAuthEntrypointAction(tokenAdmin, 'activate');
}
