import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { logger } from 'src/utils/logger';
import { join } from 'path';
import { CHAIN_KEYS, getChainId } from 'src/utils/account.util';
import { ActionIdItem } from 'src/types/auth.types';
import * as fs from 'fs-extra';
import { getAuthorizerAdapter } from 'src/utils/contract.utils';
import { getSighash } from './auth';

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

export async function getAuthAdapterActionId(
  instance: Contract,
  method: string,
): Promise<string> {
  const authAdaptor = await getAuthorizerAdapter();
  return await authAdaptor.getActionId(getSighash(instance, method));
}

export async function getActionIdsPath(): Promise<string> {
  return join(
    process.cwd(),
    'src/data/vertek/action-ids/',
    `${CHAIN_KEYS[await getChainId()]}-action-ids.json`,
  );
}

export async function getActionIdsData(): Promise<ActionIdItem[]> {
  return fs.readJSON(await getActionIdsPath());
}

export async function addNewActionIds(actionItems: ActionIdItem[]) {
  let ids = await getActionIdsData();
  ids = ids.concat(actionItems);

  await fs.writeJSON(await getActionIdsPath(), ids);
}
