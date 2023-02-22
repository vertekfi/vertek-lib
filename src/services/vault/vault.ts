import { BigNumber, Contract } from 'ethers';
import { getSignerAddress } from 'src/utils/account.util';
import { getVault, getVaultV1 } from 'src/utils/contract.utils';
import { doTransaction } from 'src/utils/transaction.utils';
import {
  ExitPoolRequest,
  JoinPoolRequest,
  QueryBatchSwap,
} from './vault.types';

export class Vault {
  constructor(readonly instance: Contract) {}

  // This will be the key for fees
  async exitPool(
    poolId: string,
    request: ExitPoolRequest,
    sender?: string,
    recipient?: string,
  ) {
    try {
      const admin = await getSignerAddress();
      return await doTransaction(
        this.instance.exitPool(
          poolId,
          sender || admin,
          recipient || admin,
          request,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async tryExitPool(
    poolId: string,
    request: ExitPoolRequest,
    sender?: string,
    recipient?: string,
  ) {
    try {
      const admin = await getSignerAddress();
      const result = await this.instance.callStatic.exitPool(
        poolId,
        sender || admin,
        recipient || admin,
        request,
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async joinPool(request: JoinPoolRequest) {
    try {
      // vault.joinPool(
      //   params.poolId,
      //   (params.from || (await this._defaultSender())).address,
      //   params.recipient ?? ZERO_ADDRESS,
      //   {
      //     assets: params.tokens,
      //     maxAmountsIn: params.maxAmountsIn ?? Array(params.tokens.length).fill(MAX_UINT256),
      //     fromInternalBalance: params.fromInternalBalance ?? false,
      //     userData: params.data ?? '0x',
      //   }
      // );
    } catch (error) {
      throw error;
    }
  }

  async swap() {
    try {
      // vault.swap(
      //   {
      //     poolId: params.poolId,
      //     kind: params.kind,
      //     assetIn: params.tokenIn,
      //     assetOut: params.tokenOut,
      //     amount: params.amount,
      //     userData: params.data,
      //   },
      //   {
      //     sender: sender.address,
      //     fromInternalBalance: false,
      //     recipient: TypesConverter.toAddress(params.to),
      //     toInternalBalance: false,
      //   },
      //   params.kind === SwapKind.GivenIn ? 0 : MAX_UINT256,
      //   MAX_UINT256
      // );
    } catch (error) {
      throw error;
    }
  }

  async batchSwap() {
    try {
    } catch (error) {
      throw error;
    }
  }

  async getPoolTokens(poolId: string): Promise<{
    tokens: string[];
    balances: BigNumber[];
    lastChangeBlock: BigNumber;
  }> {
    return this.instance.getPoolTokens(poolId);
  }

  async getPoolTokenInfo(
    poolId: string,
    token: string,
  ): Promise<{
    cash: BigNumber;
    managed: BigNumber;
    lastChangeBlock: BigNumber;
    assetManager: string;
  }> {
    return this.instance.getPoolTokenInfo(poolId, token);
  }

  // Returns asset deltas
  async queryBatchSwap(params: QueryBatchSwap): Promise<BigNumber[]> {
    return await this.instance.queryBatchSwap(
      params.kind,
      params.swaps,
      params.assets,
      params.funds,
    );
  }
}

export async function getVaultInstance() {
  return new Vault(await getVault());
}

export async function getVaultInstanceV1() {
  return new Vault(await getVaultV1());
}
