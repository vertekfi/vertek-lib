import { BigNumber, Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { VERTEK_TREASURY_ADDRESS } from 'src/data/vertek/addresses/addresses';
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
  getERC20,
  getFeeDistributor,
  getLiquidityGaugeInstance,
  getProtocolFeesCollector,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { approveTokensIfNeeded } from 'src/utils/token.utils';
import { doTransaction, sleep } from 'src/utils/transaction.utils';
import { getFeePoolConfig } from './fee-data.utils';

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
  data: { address: string; amount: number }[],
) {
  try {
    logger.info('withdrawFeesFromCollector: starting fee withdraw');
    data = data.filter((d) => d.amount > 0);
    const tokens = data.map((d) => d.address);
    // Avoid balance too low errors from decimal precision
    const amounts = data.map((d) => {
      const isDecimalCase = d.amount < 1;
      const amountStr = String(d.amount);
      const finalAmount = isDecimalCase
        ? amountStr.slice(0, amountStr.length - 4)
        : amountStr.split('.')[0].slice(0, amountStr.length - 4);

      return parseUnits(finalAmount);
    });

    const feeCollector = await getProtocolFeesCollector();
    await doTransaction(
      feeCollector.withdrawCollectedFees(
        tokens,
        amounts,
        await getSignerAddress(),
      ),
    );

    logger.success('Fee withdraw successful');
  } catch (error) {
    logger.error('withdrawFeesFromCollector failed');
    console.log(error);
  }
}

export async function depositVeFees(tokens: string[], amount: BigNumber[]) {
  logger.info(
    `depositVeFees: depositing ${tokens.length} tokens to fee dist..`,
  );
  const feeDist = await getFeeDistributor();

  await approveTokensIfNeeded(
    tokens,
    await getSignerAddress(),
    feeDist.address,
  );

  await doTransaction(await feeDist.depositTokens(tokens, amount));

  logger.success('depositVeFees: deposit successful');
}

export async function doGaugeFeeWithdraws(
  gauges: GqlProtocolPendingGaugeFee[],
) {
  throw new Error(`Fee management contract ready?`);
  // Save first in case of tx failure during the process
  // saveGaugeFeesData(gauges);
  // logger.info(
  //   `saveGaugeFeesData: starting fee withdraws for ${gauges.length} gauges`,
  // );
  // for (const gauge of gauges) {
  //   if (gauge.amount > 0) {
  //     logger.success(`Start fee withdraw for ${gauge.gauge}`);
  //     const instance = await getLiquidityGaugeInstance(gauge.gaugeAddress);
  //     await performAuthEntrypointAction(instance, 'withdrawFees');
  //     logger.success(`${gauge.gauge} withdraw complete`);
  //     await sleep();
  //   }
  // }
  // logger.success(`doGaugeFeeWithdraws complete`);
}

// This should include the full amounts for ashare, ames, aalto pool tokens
export async function sendFeesToTreasury(
  data: { address: string; amount: BigNumber }[],
) {
  logger.info('sendFeesToTreasury: starting fee transfers');
  for (const transfer of data) {
    await sleep(1000);
    logger.info('starting transfer for token: ' + transfer.address);
    const token = await getERC20(transfer.address);
    await doTransaction(
      token.transfer(VERTEK_TREASURY_ADDRESS, transfer.amount),
    );
    logger.success('Transfer successful');
  }

  logger.success('Fee transfers complete');
}
