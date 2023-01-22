import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import {
  getAuthAdapterEntrypoint,
  getTimelockAuthorizer,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { join } from 'path';
import {
  CHAIN_KEYS,
  getChainId,
  getSignerAddress,
} from 'src/utils/account.util';
import { ActionIdItem } from 'src/types/auth.types';
import * as fs from 'fs-extra';

export async function getActionId(
  instance: Contract,
  method: string,
  contractInterface?: Interface,
): Promise<string> {
  const selector = (contractInterface ?? instance.interface).getSighash(method);
  const actionId = await instance.getActionId(selector);
  logger.info(`Action ID: ${actionId}`);
  return actionId;
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
  await awaitTransactionComplete(
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
