import { vertekBackendClient } from 'src/services/subgraphs/vertek/vertek-backend-gql-client';
import {
  getVaultInstance,
  getVaultInstanceV1,
  Vault,
} from 'src/services/vault/vault';
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

  // Can have admin mutations to save this stuff backend if ever needed
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

export async function doVertekPoolFeeWithdraw(poolId: string) {
  const pool = await vertekBackendClient.getPool(poolId);
  console.log(pool);
}
