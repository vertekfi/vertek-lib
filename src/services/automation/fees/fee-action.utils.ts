import { BigNumber, Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { performAuthEntrypointAction } from 'src/services/auth/auth';
import { Multicaller } from 'src/services/standalone-utils/multicaller';
import {
  GqlProtocolFeesCollectorAmounts,
  GqlProtocolPendingGaugeFee,
} from 'src/services/subgraphs/vertek/generated/vertek-subgraph-types';
import { vertekBackendClient } from 'src/services/subgraphs/vertek/vertek-backend-gql-client';
import {
  getVaultInstance,
  getVaultInstanceV1,
  Vault,
} from 'src/services/vault/vault';
import {
  getRpcProvider,
  getSigner,
  getSignerAddress,
} from 'src/utils/account.util';
import {
  getContractAddress,
  getFeeDistributor,
  getLiquidityGaugeInstance,
  getProtocolFeesCollector,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { doTransaction, sleep } from 'src/utils/transaction.utils';
import { getFeePoolConfig, saveGaugeFeesData } from './fee-data.utils';

/**
 * Pull the config for the pool(from JSON file for now)
 * @param poolId
 */
export async function doPoolFeeWithdraw(poolId: string) {
  const feeConfig = getFeePoolConfig(poolId);

  const vault = feeConfig.isV1
    ? await getVaultInstanceV1()
    : await getVaultInstance();

  // Could have admin mutations to save this stuff backend
  const pool = await vertekBackendClient.getPool(poolId);
  console.log(pool);

  // const poolId =
  //   '0x016fcb8c8cb43bd0afb0be7486aadee49783487c00020000000000000000002d'; // PEBBLE-ETH
  // const pool = await getWeightedPoolToken(
  //   '0x016fcb8c8cb43bd0afb0be7486aadee49783487c',
  // );
  // const aeqVault = await getVaultInstanceByAddress(
  //   '0xEE1c8DbfBf958484c6a4571F5FB7b99B74A54AA7',
  // );

  // const [tokenInfo, devBalance] = await Promise.all([
  //   aeqVault.getPoolTokens(poolId),
  //   pool.balanceOf(await getSignerAddress()),
  // ]);

  // const tokenOut = getTokenAddress('ETH');
  // const exitRequest = getDefaultSingleTokenExitRequest(
  //   tokenInfo.tokens,
  //   devBalance,
  //   tokenInfo.tokens.indexOf(tokenOut),
  // );

  // // console.log(exitRequest);
  // // console.log(formatEther(await getBalanceForToken(tokenOut)));

  // await aeqVault.exitPool(poolId, exitRequest);

  //  console.log(formatEther(await getBalanceForToken(tokenOut)));
}

export async function withdrawFeesFromCollector(
  data: GqlProtocolFeesCollectorAmounts[],
) {
  try {
    const tokens = data.map((d) => d.token);
    const amounts = data.map((d) => parseUnits(d.amount.split('.')[0]));

    const feeCollector = await getProtocolFeesCollector();
    await doTransaction(
      feeCollector.withdrawCollectedFees(
        tokens,
        amounts,
        await getSignerAddress(),
      ),
    );
  } catch (error) {
    logger.error('withdrawFeesFromCollector failed');
    console.log(error);
  }
}

export async function depositVeFees(tokens: string[], amount: BigNumber[]) {
  const feeDist = await getFeeDistributor();

  await approveTokensIfNeeded(
    tokens,
    await getSignerAddress(),
    feeDist.address,
  );

  await doTransaction(await feeDist.depositTokens(tokens, amount));
}

export async function doGaugeFeeWithdraws(
  gauges: GqlProtocolPendingGaugeFee[],
) {
  // Save first in case of tx failure during the process
  saveGaugeFeesData(gauges);
  logger.info(
    `saveGaugeFeesData: starting fee withdraws for ${gauges.length} gauges`,
  );
  for (const gauge of gauges) {
    if (gauge.pendingPoolTokensFee > 0) {
      logger.success(`Start fee withdraw for ${gauge.gauge}`);
      const instance = await getLiquidityGaugeInstance(gauge.gaugeAddress);
      await performAuthEntrypointAction(instance, 'withdrawFees');
      logger.success(`${gauge.gauge} withdraw complete`);
      await sleep();
    }
  }

  logger.success(`doGaugeFeeWithdraws complete`);
}

export async function doVertekPoolFeeWithdraws(pools: { address: string }[]) {
  //
}

export async function doVertekPoolFeeWithdraw(poolId: string) {
  const pool = await vertekBackendClient.getPool(poolId);
  console.log(pool);

  // // do withdraw, get tokens
  // for (const pool of someshit) {
  // }

  // const feeCollector = await getProtocolFeesCollector();
  // const vault = await getVaultInstance();
}
