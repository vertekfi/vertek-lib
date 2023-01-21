import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { getAuthAdapterEntrypoint } from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';

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
