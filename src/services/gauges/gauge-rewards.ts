import { BigNumber } from 'ethers';
import { getSignerAddress } from 'src/utils/account.util';
import { ANY_ADDRESS } from 'src/utils/constants';
import { getLiquidityGaugeInstance } from 'src/utils/contract.utils';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { getAuthAdapterActionId } from '../auth/action-ids';
import {
  grantVaultAuthorizerPermissions,
  performAuthEntrypointAction,
} from '../auth/auth';

/**
 * Caller should already be Vault authorized to call this function
 * @param address
 * @param token
 * @param distributor
 */
export async function addRewardToGauge(
  gaugeAddress: string,
  token: string,
  distributor?: string,
) {
  distributor = distributor ?? (await getSignerAddress());
  const gauge = await getLiquidityGaugeInstance(gaugeAddress);

  await approveTokensIfNeeded([token], distributor, gauge.address);

  return await performAuthEntrypointAction(gauge, 'add_reward', [
    token,
    distributor,
  ]);
}

/**
 * Caller should already be Vault authorized to call this function.
 * `addRewardToGauge` should have been called beforehand to add token plus set token approval for gauge.
 * @param address
 * @param token
 * @param distributor
 */
export async function depositRewardToGauge(
  gaugeAddress: string,
  token: string,
  amount: BigNumber,
) {
  const gauge = await getLiquidityGaugeInstance(gaugeAddress);
  return await performAuthEntrypointAction(gauge, 'deposit_reward_token', [
    token,
    amount,
  ]);
}
