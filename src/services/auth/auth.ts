import { Contract } from '@ethersproject/contracts';
import {
  getAuthAdapterEntrypoint,
  getAuthorizerAdapter,
  getTimelockAuthorizer,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { getSignerAddress } from 'src/utils/account.util';

export async function getAdapterActionIdAndVaultGrantOnTarget(
  targetContract: Contract,
  method: string,
  who?: string,
) {
  const adapter = await getAuthorizerAdapter();
  const id = await adapter.getActionId(getSighash(targetContract, method));
  await grantVaultAuthorizerPermissions([id], [targetContract.address], who);
}

export async function grantVaultAuthorizerPermissions(
  actionIds: string[],
  targetContracts: string[],
  who?: string,
) {
  logger.info('grantVaultAuthorizerPermissions');

  const authorizer = await getTimelockAuthorizer();
  return await awaitTransactionComplete(
    authorizer.grantPermissions(
      actionIds,
      who ?? (await getSignerAddress()),
      targetContracts,
    ),
  );
}

export async function performAuthEntrypointAction(
  performingOn: Contract,
  functionName: string,
  args = [],
) {
  const adaptorEntrypoint = await getAuthAdapterEntrypoint();
  const calldata = performingOn.interface.encodeFunctionData(
    functionName,
    args,
  );
  return await awaitTransactionComplete(
    adaptorEntrypoint.performAction(performingOn.address, calldata),
  );
}

export async function canPerformAction(
  actionId: string,
  who: string,
  whatContract: string,
) {
  const authorizer = await getTimelockAuthorizer();
  return await authorizer.canPerform(actionId, who, whatContract);
}

export function getSighash(instance: Contract, method: string) {
  return instance.interface.getSighash(method);
}
