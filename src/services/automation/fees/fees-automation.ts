import {
  getAllPoolsWithGauges,
  getContractAddress,
  getERC20,
  getFeeDistributor,
  getLiquidityGaugeInstance,
  getProtocolFeesCollector,
  getVault,
  getVertekFeeManager,
} from 'src/utils/contract.utils';
import { doTransaction } from 'src/utils/transaction.utils';

import * as fs from 'fs-extra';
import { getSignerAddress } from 'src/utils/account.util';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { join } from 'path';
import { csvService } from 'src/services/standalone-utils/csv.service';
import { vertekBackendClient } from 'src/services/subgraphs/vertek/vertek-backend-gql-client';
import { createWeekDataDirectory } from './fee-data.utils';
import { v1FeeAutomation } from './v1/v1-fee-automation';
import {
  approveTokensIfNeeded,
  getAccountTokenBalances,
  mapTokensToAddressObjectMap,
} from 'src/utils/token.utils';
import { logger } from 'src/utils/logger';
import {
  STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT,
  TREASURY_PERCENT,
  VEVRTK_PERCENT,
} from './data';
import { FeeDistributionInfo, TokenFeeInfo } from './fee.types';
import { feeVaultService } from './fee-vault.service';
import { GqlPoolMinimal } from 'src/services/subgraphs/vertek/generated/vertek-subgraph-types';
import { getVaultInstance } from 'src/services/vault/vault';
import { getDefaultAllTokensExitRequest } from 'src/services/vault/vault-utils';
import { getAuthAdapterActionId } from 'src/services/auth/action-ids';
import { grantVaultAuthorizerPermissions } from 'src/services/auth/auth';
import { ANY_ADDRESS } from 'src/utils/constants';

const tradingFeesFileName = 'trading-fees.json';
const gaugeFeesFileName = 'gauge-fees.json';
const totalBptFeesFileName = 'total-bpt-fees.json';
const devAccountPreBalancesFileName = 'dev-account-pre-balances.json';
const devAccountPostBalancesFileName = 'dev-account-post-balances.json';
const feeCollectorPreWithdrawTotalsName =
  'fee-collector-pre-withdraw-balances.json';
const feeDistributionFileName = 'protocol-fees-distribution.json';

export class FeeManagementAutomation {
  constructor() {}

  async run() {
    try {
      // create directory for week
      const dataDir = createWeekDataDirectory();
      // const feeData = await vertekBackendClient.getAllPendingProtocolFees();

      // // Save raw trading and gauge fees from the start
      // const feeCollectorData = feeData.feeCollector.values
      //   .sort((p1, p2) => (p1.amount > p2.amount ? -1 : 1))
      //   .map((info) => {
      //     return {
      //       ...info,
      //       valueUSD: parseFloat(info.valueUSD),
      //     };
      //   });

      // const gaugeFeeData = feeData.gauges.values.sort((p1, p2) =>
      //   p1.valueUSD > p2.valueUSD ? -1 : 1,
      // );

      // const { tradePath, gaugePath } = this.saveRawTradingAndGaugeFeeInfo(
      //   dataDir,
      //   {
      //     totalValueUSD: feeData.feeCollector.totalValueUSD,
      //     values: feeCollectorData,
      //   },
      //   {
      //     totalValueUSD: feeData.gauges.totalValueUSD,
      //     values: gaugeFeeData,
      //   },
      //   // true,
      // );

      // // get total fees trade/gauge per BPT
      // this.saveTotalFeesPerToken(dataDir, tradePath, gaugePath);

      // // Watch for dev account balance differences before/after withdrawing fee

      // await this.doAccountBalanceSnapshot(
      //   join(dataDir, devAccountPreBalancesFileName),
      // await getSignerAddress()
      // );

      // Needs to happen first so they go to fee collector
      // TODO: DO NOT UPDATE FEE FILE DATA AFTER THIS
      // await this.withdrawGaugeFees(dataDir);

      // const finalCollectorAmountsPath = join(
      //   dataDir,
      //   feeCollectorPreWithdrawTotalsName,
      // );
      // await this.doAccountBalanceSnapshot(
      //   finalCollectorAmountsPath,
      //   getContractAddress('ProtocolFeesCollector'),
      // );

      // await this.doFeeCollectorWithdraw(finalCollectorAmountsPath);

      // Snapshot again in case needed for reference
      // await this.doAccountBalanceSnapshot(
      //   join(dataDir, devAccountPostBalancesFileName),
      //   await getSignerAddress(),
      // );

      // Break up amounts to where they go (stable fund, treasury, veVRTK)
      // this.saveFeeDistributionData(
      //   join(dataDir, feeCollectorPreWithdrawTotalsName),
      //   dataDir,
      // );

      // Fee dist deposits for VE (Include VRTK after this week. Already there for this week)
      // const distPath = join(dataDir, feeDistributionFileName);

      // // Need pool id's
      // const { poolGetPools } = await vertekBackendClient.sdk.GetAllPools();

      await this.doVeFeeDistribution(join(dataDir, feeDistributionFileName));
      // await this.doStableGaugeFundDistribution(dataDir, poolGetPools);

      //  await v1FeeAutomation.run()

      logger.success('Fee automation complete');
    } catch (error) {
      console.log(error);
    }
  }

  private async doVeFeeDistribution(dataPath: string) {
    const data: FeeDistributionInfo = fs.readJSONSync(dataPath);
    // TODO: Next week, checkpoint stakeless and add to ve deposit tokens
    // await withdrawTokenHolderBalance(); // stakeless
    // await depositVeFees([getTokenAddress('VRTK')], [parseUnits('0')]);

    const feeDist = await getFeeDistributor();
    const tokens = data.veVRTK.data.map((d) => d.address);
    const amountsBN = data.veVRTK.data.map((d) => d.amountBN);

    console.log(tokens);

    // await approveTokensIfNeeded(
    //   tokens,
    //   await getSignerAddress(),
    //   feeDist.address,
    // );
    // const tx = await doTransaction(feeDist.depositTokens(tokens, amountsBN));
    // data.veVRTK.txHash = tx.transactionHash;
    // data.veVRTK.distributedAt = new Date().toUTCString();
    // fs.writeJsonSync(dataPath, data);
  }

  private async doStableGaugeFundDistribution(
    dataDir: string,
    pools: Partial<GqlPoolMinimal>[],
  ) {
    const data: FeeDistributionInfo = fs.readJSONSync(
      join(dataDir, feeDistributionFileName),
    );
    // Use this higher level then after testing this
    const tmpDirPath = join(dataDir, 'tmp');
    fs.ensureDirSync(tmpDirPath);

    const exitsDataPath = join(dataDir, 'pool-exits');
    fs.ensureDirSync(exitsDataPath);

    // const stableData = data.stableGaugeFund;
    // const vault = await getVaultInstance();
    const account = await getSignerAddress();

    // for (const info of stableData.data) {
    //   const pool = pools.find((p) => p.address === info.address);
    //   if (!pool) {
    //     // TODO: Just working with BPT's for now but will want to account for pools
    //     // that pay in single tokens like old stable pools
    //     logger.warn(`No matching pool for fee info address: ${info.address}`);
    //     continue;
    //   }

    //   const poolExitPath = join(exitsDataPath, `${pool.id}-stable.json`);
    //   fs.ensureFileSync(poolExitPath);

    //   const tokens = pool.displayTokens.map((t) => t.address);

    //   const preBalances = await getAccountTokenBalances(
    //     mapTokensToAddressObjectMap(tokens),
    //     account,
    //     false,
    //   );

    //   console.log('pre balances:');
    //   console.log(preBalances);

    //   const preFile = join(tmpDirPath, `${pool.id}-pre.json`);
    //   fs.writeJSONSync(preFile, {
    //     poolId: pool.id,
    //     preBalances,
    //   });

    //   try {
    //     const exitRequest = getDefaultAllTokensExitRequest(
    //       tokens,
    //       info.amountBN,
    //     );
    //     await vault.exitPool(pool.id, exitRequest);

    //     const postBalances = await getAccountTokenBalances(
    //       mapTokensToAddressObjectMap(tokens),
    //       account,
    //       false,
    //     );

    //     console.log('post balances:');
    //     console.log(postBalances);

    //     const postFile = join(tmpDirPath, `${pool.id}-post.json`);
    //     fs.writeJSONSync(postFile, {
    //       poolId: pool.id,
    //       postBalances,
    //     });

    //     const preData: any[] = fs.readJSONSync(preFile).preBalances;
    //     const postData: any[] = fs.readJSONSync(postFile).postBalances;

    //     const diffs = [];
    //     preData.forEach((pre) => {
    //       const post = postData.find((d) => d.address === pre.address);
    //       const gain = parseFloat(post.balance) - parseFloat(pre.balance);
    //       diffs.push({
    //         address: pre.address,
    //         amount: gain,
    //       });
    //     });

    //     console.log(diffs);
    //     fs.writeJSONSync(poolExitPath, diffs);
    //   } catch (error) {
    //     console.error(error);
    //     fs.removeSync(preFile);
    //   }
    // }

    // Need to aggregate token amounts after exits
    // const files = fs.readdirSync(exitsDataPath);
    // const records: { [token: string]: number } = {};

    // for (const file of files) {
    //   const data: any[] = fs.readJSONSync(join(exitsDataPath, file));

    //   data.forEach((amt) => {
    //     if (!records[amt.address]) {
    //       records[amt.address] = 0;
    //     }

    //     records[amt.address] += amt.amount;
    //   });
    // }

    // const stableFundAmounts = Object.entries(records).map((obj) => {
    //   return {
    //     address: obj[0],
    //     amount: obj[1],
    //   };
    // });

    const stableAmountsPath = join(dataDir, 'stable-gauge-fund-amounts.json');
    // fs.writeJSONSync(
    //   stableAmountsPath,
    //   stableFundAmounts,
    // );

    const stableFundAmounts = fs.readJSONSync(stableAmountsPath);

    const tokens = stableFundAmounts
      .filter(
        (amt) => amt.address !== '0xed236c32f695c83efde232c288701d6f9c23e60e',
      )
      .map((amt) => amt.address);
    const amountsBN = stableFundAmounts.map((amt) =>
      parseUnits(String(amt.amount)),
    );
    // await approveTokensIfNeeded(
    //  tokens,
    //   '0x7aa7423541fBC1Cf7Fb2F5d979f39aF00ED50eeE',
    //   account,
    // );

    // Send all single token amounts to fund handler account
    // TODO: Handle this in the contract like most other things
    const feeManager = await getVertekFeeManager();

    await approveTokensIfNeeded(tokens, account, feeManager.address);

    // console.log(
    //   await feeManager.isValidRecipient(STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT),
    // );

    // const tk = await getERC20(tokens[2]);
    // console.log(
    //   formatEther(await tk.balanceOf(STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT)),
    // );
    // await doTransaction(
    //   feeManager.transferAmountsToRecipient(
    //     [tokens[2]],
    //     [amountsBN[2]],
    //     STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT,
    //   ),
    // );
    // console.log(
    //   formatEther(await tk.balanceOf(STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT)),
    // );
  }

  private async TreasuryDistribution(
    dataPath: string,
    pools: GqlPoolMinimal[],
  ) {
    const data: FeeDistributionInfo = fs.readJSONSync(dataPath);
    // Need to break lp's first
    // Then swap into a stable or blue chip depending on best swap return (Can query backend SOR for this)

    // treasury transfer. Can add function to send address list to fee manager and have it pull and send to treasury one shot (need one time approval for all tokens)
    // *Could have sent them to contract and have function that transfers list of addresses to an approved destination
  }

  private saveFeeDistributionData(feeDataFilePath: string, dataDir: string) {
    const data: TokenFeeInfo[] = fs.readJSONSync(feeDataFilePath);

    const veVRTK = [];
    const treasury = [];
    const stableGaugeFund = [];

    data.forEach((item) => {
      const amount = parseFloat(item.balance);
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
  }

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
  }

  private async doFeeCollectorWithdraw(feeDataFilePath: string) {
    logger.info('doFeeCollectorWithdraw: starting fee withdraw');

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

  // Break LP to "extract" the tokens
  async withdrawPoolTokenLiquidity() {
    const vault = await getVault();
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

  async prepareTokenAmountsToSave() {
    // try {
    //   console.log('Getting fee collector token amounts..');
    //   console.log(new Date().toLocaleString());
    //   const withBalance = await this.getFeeCollectorNonZeroTokenBalances();
    //   const fileName = `fees-${Date.now()}.json`;
    //   const filePath = join(process.cwd(), `src/data/vertek/fees/${fileName}`);
    //   await fs.writeJson(filePath, withBalance);
    //   console.log(new Date().toLocaleString());
    //   const data = {
    //     filePath,
    //     fileName,
    //   };
    //   console.log(data);
    //   return data;
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async saveToCSV(info: { fileName: string; filePath: string }) {
    const data = await fs.readJSON(info.filePath);
    const name = info.fileName.split('.')[0];

    await csvService.write(
      join(process.cwd(), 'fees/', `${name}.csv`),
      [
        { id: 'token', title: 'Token' },
        { id: 'amount', title: 'Amount' },
        { id: 'address', title: 'Address' },
      ],
      data,
    );
  }

  private saveTotalFeesPerToken(
    dataDir: string,
    tradePath: string,
    gaugePath: string,
  ) {
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
