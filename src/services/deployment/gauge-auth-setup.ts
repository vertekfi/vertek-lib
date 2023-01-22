import { Contract } from 'ethers';
import { ActionIdItem } from 'src/types/auth.types';
import { getChainId } from 'src/utils/account.util';
import { ANY_ADDRESS } from 'src/utils/constants';
import {
  getGaugeController,
  getLiquidityGaugeTemplate,
  getVotingEscrow,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { getAuthAdapterActionId, updateActionIds } from '../auth/action-ids';
import { grantVaultAuthorizerPermissions } from '../auth/auth';

export async function initGaugeAuthItems() {
  /**
   * Set items globally/everywhere for gauge instances,
   * so setting per address is not needed (will map to the same action id for all regardless)
   */
  //
  // auth to add_gauge, add_reward
  // on gauges (use template address?) auth to set fee/withdraw fee, to withdraw fees, add_reward, etc
  // these need to go through the AuthorizerAdaptor(by way of entrypoint) due to the vyper thing
  // save off action id's for convenience

  /**
   * Collect action ids and targets and grant permissions all in one transaction
   */

  const gaugeController = await getGaugeController();

  let actionItems: ActionIdItem[] = [];
  const actionIds: string[] = [];
  const targets: string[] = [];

  const controllerActionItems = await getGaugeControllerActionItems(
    gaugeController,
  );
  actionItems = actionItems.concat(controllerActionItems);
  controllerActionItems.forEach((action) => {
    actionIds.push(action.actionId);
    targets.push(gaugeController.address);
  });

  const votingEsrow = await getVotingEscrow();
  const veActionItems = await getVotingEscrowActionItems(votingEsrow);
  actionItems = actionItems.concat(veActionItems);
  veActionItems.forEach((action) => {
    actionIds.push(action.actionId);
    targets.push(votingEsrow.address);
  });

  const gaugeTemplate = await getLiquidityGaugeTemplate();
  const gaugeActionItems = await getLiquidityGaugeActionItems(gaugeTemplate);
  actionItems = actionItems.concat(gaugeActionItems);
  gaugeActionItems.forEach((action) => {
    actionIds.push(action.actionId);
    targets.push(ANY_ADDRESS); // will set for all gauge instances/addresses
  });

  await grantVaultAuthorizerPermissions(actionIds, targets);

  await updateActionIds(actionItems);
}

export async function getGaugeControllerActionItems(
  gaugeController: Contract,
): Promise<ActionIdItem[]> {
  logger.info('getGaugeControllerActionItems');

  const contractName = ' GaugeController';
  const contractAddress = gaugeController.address;
  const chainId = await getChainId();

  const actionItems: ActionIdItem[] = [];

  function addItem(actionId: string, method: string) {
    actionItems.push({
      actionId,
      contractName,
      contractAddress,
      chainId,
      method,
    });
  }

  let method = 'add_type';
  let actionId = await getAuthAdapterActionId(gaugeController, method);
  addItem(actionId, method);

  method = 'add_gauge';
  actionId = await getAuthAdapterActionId(gaugeController, method);
  addItem(actionId, method);

  method = 'change_type_weight';
  actionId = await getAuthAdapterActionId(gaugeController, method);
  addItem(actionId, method);

  return actionItems;
}

export async function getVotingEscrowActionItems(
  votingEsrow: Contract,
): Promise<ActionIdItem[]> {
  logger.info('getVotingEscrowActionItems');

  const contractName = ' VotingEscrow';
  const contractAddress = votingEsrow.address;
  const chainId = await getChainId();

  const actionItems: ActionIdItem[] = [];

  function addItem(actionId: string, method: string) {
    actionItems.push({
      actionId,
      contractName,
      contractAddress,
      chainId,
      method,
    });
  }

  let method = 'admin_create_lock_for';
  let actionId = await getAuthAdapterActionId(votingEsrow, method);
  addItem(actionId, method);

  method = 'admin_increase_amount_for';
  actionId = await getAuthAdapterActionId(votingEsrow, method);
  addItem(actionId, method);

  method = 'admin_increase_total_stake_for';
  actionId = await getAuthAdapterActionId(votingEsrow, method);
  addItem(actionId, method);

  method = 'apply_smart_wallet_checker';
  actionId = await getAuthAdapterActionId(votingEsrow, method);
  addItem(actionId, method);

  method = 'commit_smart_wallet_checker';
  actionId = await getAuthAdapterActionId(votingEsrow, method);
  addItem(actionId, method);

  return actionItems;
}

export async function getLiquidityGaugeActionItems(
  instance: Contract,
): Promise<ActionIdItem[]> {
  logger.info('getLiquidityGaugeActionItems');

  const contractName = ' LiquidityGaugeV5';
  const contractAddress = instance.address;
  const chainId = await getChainId();

  const actionItems: ActionIdItem[] = [];

  function addItem(actionId: string, method: string) {
    actionItems.push({
      actionId,
      contractName,
      contractAddress,
      chainId,
      method,
    });
  }

  let method = 'add_reward';
  let actionId = await getAuthAdapterActionId(instance, method);
  addItem(actionId, method);

  method = 'set_reward_distributor';
  actionId = await getAuthAdapterActionId(instance, method);
  addItem(actionId, method);

  method = 'killGauge';
  actionId = await getAuthAdapterActionId(instance, method);
  addItem(actionId, method);

  method = 'unkillGauge';
  actionId = await getAuthAdapterActionId(instance, method);
  addItem(actionId, method);

  method = 'setRelativeWeightCap';
  actionId = await getAuthAdapterActionId(instance, method);
  addItem(actionId, method);

  method = 'setDepositFee';
  actionId = await getAuthAdapterActionId(instance, method);
  addItem(actionId, method);

  method = 'setWithdrawFee';
  actionId = await getAuthAdapterActionId(instance, method);
  addItem(actionId, method);

  method = 'updateFeeExempt';
  actionId = await getAuthAdapterActionId(instance, method);
  addItem(actionId, method);

  method = 'withdrawFees';
  actionId = await getAuthAdapterActionId(instance, method);
  addItem(actionId, method);

  return actionItems;
}
