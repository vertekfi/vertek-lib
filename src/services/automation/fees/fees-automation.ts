import {
  getERC20,
  getFeeDistributor,
  getProtocolFeesCollector,
  getTokenAddress,
  getVertekFeeManager,
} from 'src/utils/contract.utils';
import { doTransaction } from 'src/utils/transaction.utils';

import * as fs from 'fs-extra';
import { getSignerAddress } from 'src/utils/account.util';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { join } from 'path';
import { vertekBackendClient } from 'src/services/subgraphs/vertek/vertek-backend-gql-client';
import { v1FeeAutomation } from './v1/v1-fee-automation';
import {
  approveTokensIfNeeded,
  getAccountTokenBalances,
  mapTokensToAddressObjectMap,
} from 'src/utils/token.utils';
import { logger } from 'src/utils/logger';
import {
  BLUECHIP_ADDRESSES,
  STABLE_ADDRESSES,
  STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT,
  SWAP_CONFIGS,
  TREASURY_PERCENT,
  VEVRTK_PERCENT,
} from './data';
import { FeeDistributionInfo, TokenFeeInfo } from './fee.types';
import {
  GqlPoolMinimal,
  GqlPoolToken,
  GqlSorSwapType,
  GqlToken,
} from 'src/services/subgraphs/vertek/generated/vertek-subgraph-types';
import { getVaultInstance } from 'src/services/vault/vault';
import { getDefaultAllTokensExitRequest } from 'src/services/vault/vault-utils';
import { withdrawTokenHolderBalance } from '../liquidity-mining/liquidity-mining-automation';
import { checkpointStakelessGauge } from 'src/services/gauges/gauge-utils';
import { BigNumber } from 'ethers';

export const tradingFeesFileName = 'trading-fees.json';
export const gaugeFeesFileName = 'gauge-fees.json';
export const totalBptFeesFileName = 'total-bpt-fees.json';
export const devAccountPreBalancesFileName = 'dev-account-pre-balances.json';
export const devAccountPostBalancesFileName = 'dev-account-post-balances.json';
export const feeCollectorPreWithdrawTotalsName =
  'fee-collector-pre-withdraw-balances.json';
export const feeDistributionFileName = 'protocol-fees-distribution.json';

export class FeeManagementAutomation {
  constructor() {}

  async run() {
    try {
      //  await v1FeeAutomation.run()

      logger.success('Fee automation complete');
    } catch (error) {
      console.log(error);
    }
  }

  async saveRawFeeData(dataDir: string) {
    logger.info('saveRawFeeData: saving initial fee data');
    const feeData = await vertekBackendClient.getAllPendingProtocolFees();

    // Save raw trading and gauge fees from the start
    const feeCollectorData = feeData.feeCollector.values
      .sort((p1, p2) => (p1.amount > p2.amount ? -1 : 1))
      .map((info) => {
        return {
          ...info,
          valueUSD: parseFloat(info.valueUSD),
        };
      });

    const gaugeFeeData = feeData.gauges.values.sort((p1, p2) =>
      p1.valueUSD > p2.valueUSD ? -1 : 1,
    );

    const { tradePath, gaugePath } = this.saveRawTradingAndGaugeFeeInfo(
      dataDir,
      {
        totalValueUSD: feeData.feeCollector.totalValueUSD,
        values: feeCollectorData,
      },
      {
        totalValueUSD: feeData.gauges.totalValueUSD,
        values: gaugeFeeData,
      },
      // true,
    );

    return {
      tradePath,
      gaugePath,
    };
  }

  async doVeFeeDistribution(dataPath: string) {
    logger.success(`doVeFeeDistribution`);
    const data: FeeDistributionInfo = fs.readJSONSync(dataPath);

    const tokens = data.veVRTK.map((d) => d.address);
    const amountsBN = data.veVRTK.map((d) => d.amountBN);

    await checkpointStakelessGauge();
    const holderBalance = await withdrawTokenHolderBalance();

    tokens.push(getTokenAddress('VRTK'));
    amountsBN.push(holderBalance);

    console.log(tokens);
    console.log(amountsBN.map((amt) => formatEther(amt)));

    const feeDist = await getFeeDistributor();

    await approveTokensIfNeeded(
      tokens,
      await getSignerAddress(),
      feeDist.address,
    );

    await doTransaction(feeDist.depositTokens(tokens, amountsBN));

    logger.success(`doVeFeeDistribution complete`);
  }

  async doPoolTokenExitsForStableFund(
    dataDir: string,
    pools: Partial<GqlPoolMinimal>[],
  ) {
    logger.success(`doPoolTokenExitsForStableFund`);

    const data: FeeDistributionInfo = fs.readJSONSync(
      join(dataDir, feeDistributionFileName),
    );

    const vault = await getVaultInstance();

    for (const info of data.stableGaugeFund) {
      const pool = pools.find((p) => p.address === info.address);
      if (!pool) {
        // Just working with BPT's for now but will want to account for pools
        // that pay in single tokens like old stable pools
        logger.warn(`No matching pool for fee info address: ${info.address}`);
        continue;
      }

      const {
        tokens,
        poolExitPath,
        poolFilePath: preFile,
      } = await this.writePoolTokensBalances(pool, dataDir, 'stable', 'pre');

      try {
        const exitRequest = getDefaultAllTokensExitRequest(
          tokens,
          info.amountBN,
        );
        await vault.exitPool(pool.id, exitRequest);

        const { poolFilePath: postFile } = await this.writePoolTokensBalances(
          pool,
          dataDir,
          'stable',
          'post',
        );

        this.savePoolExitBalanceDiffs(preFile, postFile, poolExitPath);
      } catch (error) {
        console.error(error);
        fs.removeSync(preFile);
      }
    }

    logger.success(`doPoolTokenExitsForStableFund: Pool exits complete`);
  }

  saveStableGaugeFundDistribution(dataDir: string) {
    logger.info(`saveStableGaugeFundDistribution`);

    const exitsDataPath = join(dataDir, 'pool-exits', 'stable');
    fs.ensureDirSync(exitsDataPath);

    const files = fs.readdirSync(exitsDataPath);
    const records: { [token: string]: number } = {};

    for (const file of files) {
      const data: any[] = fs.readJSONSync(join(exitsDataPath, file));

      data.forEach((amt) => {
        if (
          amt.address.toLowerCase() ==
          '0xed236c32f695c83efde232c288701d6f9c23e60e'
        ) {
          return;
        }

        if (!records[amt.address]) {
          records[amt.address] = 0;
        }

        records[amt.address] += amt.amount;
      });
    }

    let stableFundAmounts = Object.entries(records).map((obj) => {
      return {
        address: obj[0],
        amount: obj[1],
      };
    });

    const stableAmountsPath = join(dataDir, 'stable-gauge-fund-amounts.json');
    fs.writeJSONSync(stableAmountsPath, stableFundAmounts);

    return stableAmountsPath;
  }

  // Send all single token amounts to fund handler account
  async doStableGaugeDistribution(stableAmountsPath: string) {
    logger.success(`doStableGaugeDistribution`);

    const stableFundAmounts: any[] = fs.readJSONSync(stableAmountsPath);

    const tokens: string[] = stableFundAmounts
      .filter(
        (amt) => amt.address !== '0xed236c32f695c83efde232c288701d6f9c23e60e',
      )
      .map((amt) => amt.address);

    const amountsBN: BigNumber[] = stableFundAmounts.map((amt) => {
      const amtStr = String(amt.amount);
      const strAmt = amtStr.slice(0, amtStr.length - 2);
      const bn = parseUnits(strAmt);
      return bn;
    });

    let index = 2;
    for (const token of tokens.slice(2)) {
      const tk = await getERC20(token);

      console.log(token);
      console.log('dist amount: ' + formatEther(amountsBN[index]));
      console.log(
        'Balance before: ' +
          formatEther(await tk.balanceOf(STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT)),
      );

      await doTransaction(
        tk.transfer(STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT, amountsBN[index]),
      );

      console.log(
        'Balance after: ' +
          formatEther(await tk.balanceOf(STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT)),
      );

      index++;
    }

    // const adminAddress = await getSignerAddress();
    // const feeManager = await getVertekFeeManager();
    // await approveTokensIfNeeded(tokens, adminAddress, feeManager.address);

    // await doTransaction(
    //   feeManager.transferAmountsToRecipient(
    //     [tokens[2]],
    //     [amountsBN[2]],
    //     STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT,
    //   ),
    // );

    // console.log(
    //   'Balance after: ' +
    //     formatEther(await tk.balanceOf(STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT)),
    // );

    logger.success(`doStableGaugeDistribution complete`);
  }

  private savePoolExitBalanceDiffs(
    preFilePath: string,
    postFilePath: string,
    poolExitPath: string,
  ) {
    const preData: any[] = fs.readJSONSync(preFilePath).balances;
    const postData: any[] = fs.readJSONSync(postFilePath).balances;

    const diffs = [];
    preData.forEach((pre) => {
      const post = postData.find((d) => d.address === pre.address);
      const gain = parseFloat(post.balance) - parseFloat(pre.balance);
      diffs.push({
        address: pre.address,
        amount: gain,
      });
    });

    console.log('Balance diffs:');
    console.log(diffs);

    fs.writeJSONSync(poolExitPath, diffs);
  }

  async doTreasuryPoolExits(dataDir: string, pools: Partial<GqlPoolMinimal>[]) {
    logger.success(`doTreasuryPoolExits`);

    const data: FeeDistributionInfo = fs.readJSONSync(
      join(dataDir, feeDistributionFileName),
    );

    const vault = await getVaultInstance();

    for (const info of data.treasury) {
      const pool = pools.find((p) => p.address === info.address);
      if (!pool) {
        // Just working with BPT's for now but will want to account for pools
        // that pay in single tokens like old stable pools
        logger.warn(`No matching pool for fee info address: ${info.address}`);
        continue;
      }

      const {
        tokens,
        poolExitPath,
        poolFilePath: preFile,
      } = await this.writePoolTokensBalances(pool, dataDir, 'treasury', 'pre');

      try {
        const exitRequest = getDefaultAllTokensExitRequest(
          tokens,
          info.amountBN,
        );
        await vault.exitPool(pool.id, exitRequest);

        const { poolFilePath: postFile } = await this.writePoolTokensBalances(
          pool,
          dataDir,
          'treasury',
          'post',
        );

        this.savePoolExitBalanceDiffs(preFile, postFile, poolExitPath);
      } catch (error) {
        console.error(error);
        fs.removeSync(preFile);
      }
    }

    logger.success(`doTreasuryPoolExits: Pool exits complete`);
  }

  async doTreasurySwaps(
    dataDir: string,
    tokens: GqlToken[],
    prices: { address: string; price: number }[],
  ) {
    logger.success(`doTreasurySwaps`);
    //Need to exit and swap
    // Need to find swap paths for each token (EXCEPT VRTK) to either a stable or blue chip
    // Save results and then transfer to treasury
    // Then swap into a stable or blue chip depending on best swap return (Can query backend SOR for this)

    const exitsDataPath = join(dataDir, 'pool-exits/treasury');
    const tokenAmounts = fs.readdirSync(exitsDataPath);

    // const tokenAmount: { address: string; amount: number } = {}

    const vault = await getVaultInstance();
    const adminAddress = await getSignerAddress();

    for (const file of tokenAmounts) {
      const tokenInfo: { address: string; amount: number } = fs.readJSONSync(
        join(exitsDataPath, file),
      )[0];

      const tokenAddress = tokenInfo.address.toLowerCase();
      // filter out vrtk
      if (tokenAddress === '0xed236c32f695c83efde232c288701d6f9c23e60e') {
        continue;
      }

      // We want stable or blue chips out
      if (
        STABLE_ADDRESSES.includes(tokenAddress) ||
        BLUECHIP_ADDRESSES.includes(tokenAddress)
      ) {
        continue;
      }

      // at this point we know we have a token we want to swap into something else
      // determine if stable or blue chip gives best return
      // attempt stable outputs first
      // use current price data to compare against blue chips, etc

      const poolId = file.split('.')[0];
      const price = prices.find((p) => p.address === tokenAddress);
      const tokenGql = tokens.find((t) => t.address === tokenAddress);
      const valueUSD = tokenInfo.amount * price.price;
      const swapConfig = SWAP_CONFIGS.find((c) => c.tokenIn === tokenAddress);

      if (!swapConfig) {
        logger.warn(`No swap config for token: ${tokenGql.symbol}`);
        continue;
      }

      console.log(tokenAddress);
      console.log(`Value: ${valueUSD}`);

      const swapInfo = await vertekBackendClient.sdk.GetSorSwaps({
        tokenIn: swapConfig.tokenIn,
        tokenOut: swapConfig.tokenOut,
        swapType: GqlSorSwapType.ExactIn,
        swapAmount: String(tokenInfo.amount),
        swapOptions: {},
      });

      console.log(swapInfo);
    }
  }

  private async writePoolTokensBalances(
    pool: Partial<GqlPoolMinimal>,
    dataDir: string,
    type: 'treasury' | 'stable',
    prePost: 'pre' | 'post',
  ) {
    const tmpDirPath = join(dataDir, 'tmp', type);
    fs.ensureDirSync(tmpDirPath);

    const exitsDataPath = join(dataDir, 'pool-exits', type);
    fs.ensureDirSync(exitsDataPath);

    const poolExitPath = join(exitsDataPath, `${pool.id}.json`);
    fs.ensureFileSync(poolExitPath);

    const tokens = pool.displayTokens.map((t) => t.address);

    const balances = await getAccountTokenBalances(
      mapTokensToAddressObjectMap(tokens),
      await getSignerAddress(),
      false,
    );

    console.log(`${prePost} balances:`);
    console.log(balances);

    const poolFilePath = join(tmpDirPath, `${pool.id}-${prePost}.json`);
    fs.writeJSONSync(poolFilePath, {
      poolId: pool.id,
      balances,
    });

    return {
      tokens,
      poolExitPath,
      poolFilePath,
    };
  }

  saveFeeDistributionData(feeDataFilePath: string, dataDir: string) {
    logger.success(`saveFeeDistributionData`);
    const data: TokenFeeInfo[] = fs.readJSONSync(feeDataFilePath);

    const veVRTK = [];
    const treasury = [];
    const stableGaugeFund = [];

    data.forEach((item) => {
      const amount = parseFloat(item.balance);
      if (amount < 0.00000001) {
        return;
      }
      const veAmount = amount * VEVRTK_PERCENT;
      const treasuryAmount = amount * TREASURY_PERCENT;
      // 50% but just add any extra remaining
      const stableFundAmount = amount - (veAmount + treasuryAmount);

      veVRTK.push({
        address: item.address,
        amount: veAmount,
        amountBN: parseUnits(String(veAmount)),
      });

      treasury.push({
        address: item.address,
        amount: treasuryAmount,
        amountBN: parseUnits(String(treasuryAmount)),
      });

      stableGaugeFund.push({
        address: item.address,
        amount: stableFundAmount,
        amountBN: parseUnits(String(stableFundAmount)),
      });
    });

    fs.writeJSONSync(join(dataDir, feeDistributionFileName), {
      veVRTK,
      treasury,
      stableGaugeFund,
    });

    logger.success(`saveFeeDistributionData: complete`);
  }

  /**
   * Triggers fee withdraw for all gauges to the ProtocolFeesCollector
   * @param dataDir
   */
  async withdrawGaugeFees(dataDir: string) {
    const gaugeFeeData = fs.readJSONSync(join(dataDir, gaugeFeesFileName));
    const gaugeList = gaugeFeeData.values
      .filter((g) => g.amount > 0)
      .map((g) => g.gaugeAddress);
    console.log(gaugeList);

    const feeManager = await getVertekFeeManager();
    await doTransaction(feeManager.withdrawGaugeFees(gaugeList));
  }

  async doAccountBalanceSnapshot(savePath: string, account: string) {
    logger.success(`doAccountBalanceSnapshot: Balance snapshot for ${account}`);

    const { mappedAddress, tokens, poolTokens } =
      await vertekBackendClient.getAllTokenAddressesMap();
    const balances = await getAccountTokenBalances(
      mappedAddress,
      account,
      true,
    );

    // match up pool/token info before save
    const data = balances.map((bal) => {
      const token = tokens.find((t) => t.address === bal.address);
      const pool = poolTokens.find((t) => t.address === bal.address);
      return {
        ...token,
        ...pool,
        ...bal,
      };
    });

    fs.writeJSONSync(savePath, data);

    logger.success(`doAccountBalanceSnapshot: Balance snapshot complete`);
  }

  async doFeeCollectorWithdraw(feeDataFilePath: string) {
    logger.success('doFeeCollectorWithdraw: starting fee withdraw');

    const { withdrawTokens, withdrawAmounts } =
      this.getWithdrawTokenAmounts(feeDataFilePath);

    const feeCollector = await getProtocolFeesCollector();
    await doTransaction(
      feeCollector.withdrawCollectedFees(
        withdrawTokens,
        withdrawAmounts,
        await getSignerAddress(),
      ),
    );

    logger.success('Fee withdraw successful');
  }

  getWithdrawTokenAmounts(feeDataFilePath: string) {
    const fees: TokenFeeInfo[] = fs.readJSONSync(feeDataFilePath);

    const withdrawTokens = fees.map((f) => f.address);

    // Avoid balance too low errors from decimal precision
    const withdrawAmounts = fees.map((f) =>
      parseUnits(f.balance.slice(0, f.balance.length - 2)),
    );

    return {
      withdrawTokens,
      withdrawAmounts,
    };
  }

  saveTotalFeesPerToken(dataDir: string, tradePath: string, gaugePath: string) {
    const tradeFees = fs.readJSONSync(tradePath);
    const gaugeFees = fs.readJSONSync(gaugePath);

    const values = [];
    const totalValueUSD = tradeFees.totalValueUSD + gaugeFees.totalValueUSD;
    tradeFees.values.forEach((fee) => {
      let amount = fee.amount;
      let valueUSD = fee.valueUSD;
      const gauge = gaugeFees.values.find(
        (g) => g.poolAddress === fee.poolAddress,
      );
      if (gauge) {
        amount += gauge.amount;
        valueUSD += gauge.valueUSD;
      }

      values.push({
        ...fee,
        ...gauge,
        amount,
        valueUSD,
      });
    });

    fs.writeJSONSync(join(dataDir, totalBptFeesFileName), {
      totalValueUSD,
      values,
    });
  }

  private saveRawTradingAndGaugeFeeInfo(
    dataDir: string,
    trading,
    gauges,
    overwrite = false,
  ) {
    const tradePath = join(dataDir, tradingFeesFileName);
    const gaugePath = join(dataDir, gaugeFeesFileName);

    if (!fs.pathExistsSync(tradePath) || overwrite) {
      fs.writeJSONSync(tradePath, trading);
    }

    if (!fs.pathExistsSync(gaugePath) || overwrite) {
      fs.writeJSONSync(gaugePath, gauges);
    }

    return {
      tradePath,
      gaugePath,
    };
  }
}

export const feeAutomation = new FeeManagementAutomation();
