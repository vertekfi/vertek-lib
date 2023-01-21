import { getSigner } from 'src/utils/account.util';
import {
  getAuthorizerAdapter,
  getSighash,
  getTimelockAuthorizer,
  getTokenAdmin,
} from 'src/utils/contract.utils';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { performAuthEntrypointAction } from './auth';

export async function approveTokenAdminActivation() {
  const tokenAdmin = await getTokenAdmin();
  const adapter = await getAuthorizerAdapter();
  const actionId = await adapter.getActionId(
    getSighash(tokenAdmin, 'activate'),
  );
  const authorizer = await getTimelockAuthorizer();

  await awaitTransactionComplete(
    authorizer.grantPermissions([actionId], (await getSigner()).address, [
      tokenAdmin.address,
    ]),
    3,
  );
}

export async function activateTokenAdmin() {
  const tokenAdmin = await getTokenAdmin();
  await performAuthEntrypointAction(tokenAdmin, 'activate');
}
