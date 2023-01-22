import { Contract } from 'ethers';
import { ActionIdItem } from 'src/types/auth.types';
import { getChainId } from 'src/utils/account.util';
import { ANY_ADDRESS } from 'src/utils/constants';
import {
  getGaugeAdder,
  getGaugeController,
  getLiquidityGaugeTemplate,
  getVotingEscrow,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import {
  getActionIds,
  getAuthAdapterActionId,
  addNewActionIds,
} from '../auth/action-ids';
import { grantVaultAuthorizerPermissions } from '../auth/auth';

export async function initGaugeAuthItems() {
  // These need to go through the AuthorizerAdaptor(by way of entrypoint) due to the vyper thing.
  // Save off action id's for convenience.

  /**
   * Collect action ids and targets and grant permissions all in one transaction
   */

  let actionItems: ActionIdItem[] = [];
  const actionIds: string[] = [];
  const targets: string[] = [];

  const gaugeController = await getGaugeController();
  actionItems = actionItems
    .concat(await getControllerActionItems(gaugeController))
    .map((action) => {
      actionIds.push(action.actionId);
      targets.push(gaugeController.address);
      return action;
    });

  const votingEsrow = await getVotingEscrow();
  actionItems = actionItems
    .concat(await getVotinEscrowActionItems(votingEsrow))
    .map((action) => {
      actionIds.push(action.actionId);
      targets.push(votingEsrow.address);
      return action;
    });

  const gaugeTemplate = await getLiquidityGaugeTemplate();
  actionItems = actionItems
    .concat(await getLiquidityGaugeActionItems(gaugeTemplate))
    .map((action) => {
      actionIds.push(action.actionId);
      targets.push(ANY_ADDRESS); // will set for all gauge instances/addresses
      return action;
    });

  const gaugeAdder = await getGaugeAdder();
  actionItems = actionItems
    .concat(await getGaugeAdderActionItems(gaugeAdder))
    .map((action) => {
      actionIds.push(action.actionId);
      targets.push(gaugeAdder.address);
      return action;
    });

  await grantVaultAuthorizerPermissions(actionIds, targets);

  await addNewActionIds(actionItems);
}

async function getVotinEscrowActionItems(votingEsrow: Contract) {
  logger.info('getControllerActionItems');

  return getActionItems(votingEsrow, 'VotingEscrow', [
    'admin_create_lock_for',
    'admin_increase_amount_for',
    'admin_increase_total_stake_for',
    'commit_smart_wallet_checker',
    'apply_smart_wallet_checker',
  ]);
}

async function getControllerActionItems(gaugeController: Contract) {
  logger.info('getControllerActionItems');

  return getActionItems(gaugeController, 'GaugeController', [
    'add_gauge',
    'add_type',
    'change_type_weight',
  ]);
}

export async function getGaugeAdderActionItems(gaugeAdder: Contract) {
  logger.info('getGaugeAdderActionItems');

  const chainId = await getChainId();
  const actionItems: ActionIdItem[] = [];

  // Do not need entrypoint for these. So get action id off of the contract instance itself
  for (const method of ['addEthereumGauge', 'addGaugeFactory']) {
    const actionId = await gaugeAdder.getActionId();
    actionItems.push({
      actionId,
      contractName: 'GaugeAdder',
      contractAddress: gaugeAdder.address,
      chainId,
      method,
    });
  }

  return actionItems;
}

export async function getLiquidityGaugeActionItems(
  instance: Contract,
): Promise<ActionIdItem[]> {
  logger.info('getLiquidityGaugeActionItems');

  return getActionItems(instance, 'LiquidityGaugeV5', [
    'add_reward',
    'set_reward_distributor',
    'killGauge',
    'unkillGauge',
    'setRelativeWeightCap',
    'setDepositFee',
    'setWithdrawFee',
    'updateFeeExempt',
    'withdrawFees',
  ]);
}

export async function getActionItems(
  instance: Contract,
  contractName: string,
  methods: string[],
) {
  const contractAddress = instance.address;
  const chainId = await getChainId();
  const actionItems: ActionIdItem[] = [];

  async function addItem(method: string) {
    const actionId = await getAuthAdapterActionId(instance, method);
    actionItems.push({
      actionId,
      contractName,
      contractAddress,
      chainId,
      method,
    });
  }

  for (const fn of methods) {
    await await addItem(fn);
  }

  return actionItems;
}
