import {
  getAllPoolsWithGauges,
  getContractAddress,
  getERC20,
  getLiquidityGaugeInstance,
  getProtocolFeesCollector,
  getVault,
} from 'src/utils/contract.utils';
import { doTransaction, sleep } from 'src/utils/transaction.utils';
import { performAuthEntrypointAction } from '../../auth/auth';
import * as fs from 'fs-extra';
import { BigNumber } from 'ethers';
import { getRpcProvider, getSignerAddress } from 'src/utils/account.util';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { join } from 'path';
import { csvService } from 'src/services/standalone-utils/csv.service';
import { Multicaller } from 'src/services/standalone-utils/multicaller';
import { vertekBackendClient } from 'src/services/subgraphs/vertek/vertek-backend-gql-client';

interface TokenFeeInfo {
  token: string;
  amountBN: string;
  address: string;
  amount: string;
}

export class FeeManagementAutomation {
  constructor() {}

  async run() {
    try {
      const idk = await this.getCurrentFeeBalances();
      // const { withdrawTokens, withdrawAmounts } =
      //   await this.getWithdrawTokenAmounts(fees);
      // console.log(fees);
      // await this.withdrawFeeTokens()
    } catch (error) {
      console.log(error);
    }
  }

  async getPendingFeeTokens() {
    // use backend to get all tokens
  }

  async withdrawGaugeFees() {
    const pools = await getAllPoolsWithGauges();
    for (const pool of pools) {
      const g = await getLiquidityGaugeInstance(pool.gauge.address);
      await performAuthEntrypointAction(g, 'withdrawFees');
      await sleep(1000);
    }
  }

  // Break LP to "extract" the tokens
  async withdrawPoolTokenLiquidity() {
    const vault = await getVault();
  }

  async withdrawFeeTokens(
    withdrawTokens: string[],
    withdrawAmounts: BigNumber[],
  ) {
    const feeCollector = await getProtocolFeesCollector();

    await doTransaction(
      feeCollector.withdrawCollectedFees(
        withdrawTokens,
        withdrawAmounts,
        await getSignerAddress(),
      ),
    );
  }

  async readFeeInfo(filePath: string) {
    return fs.readJSON(filePath);
  }

  async getCurrentFeeBalances() {
    try {
      const info = await this.prepareTokenAmountsToSave();
      console.log(info);
      const fees: TokenFeeInfo[] = await fs.readJSON(info.filePath);

      await this.saveToCSV(info);

      return this.getWithdrawTokenAmounts(fees);
    } catch (error) {
      throw error;
    }
  }

  getWithdrawTokenAmounts(fees: TokenFeeInfo[]) {
    const withdrawTokens = fees.map((f) => f.address);
    const withdrawAmounts = fees.map((f) => parseUnits(f.amount));

    return {
      withdrawTokens,
      withdrawAmounts,
    };
  }

  async prepareTokenAmountsToSave() {
    try {
      console.log('Getting fee collector token amounts..');
      console.log(new Date().toLocaleString());
      const withBalance = await this.getFeeCollectorNonZeroTokenBalances();

      const fileName = `fees-${Date.now()}.json`;
      const filePath = join(process.cwd(), `src/data/vertek/fees/${fileName}`);
      await fs.writeJson(filePath, withBalance);

      console.log(new Date().toLocaleString());

      const data = {
        filePath,
        fileName,
      };

      console.log(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getFeeCollectorNonZeroTokenBalances() {
    return vertekBackendClient.getAllPendingProtocolFees();
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
}
