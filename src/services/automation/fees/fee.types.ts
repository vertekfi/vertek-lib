import { BigNumber } from 'ethers';

export interface FeeWithdrawInfo {
  poolId: string;
  tokenOut: string;
  amountReceived: string;
  date: string;
}

// TODO: Should just database this then once process is settled in
export interface FeePoolWithdrawConfig {
  isV1: boolean; // Determines which vault and services to use
  address?: string; // Only needed for V1
  poolId: string; // Rest of data can be pulled from this
  tokenOut: string; // single asset pool withdraw
  lastWithdraw: string; // date/time stamp of last withdraw action for the pool
  keepPoolToken?: boolean; // In case the swap out shouldn't happen for some reason. Assume tokenOut
}

export interface TokenFeeInfo {
  amountBN: BigNumber;
  address: string;
  balance: string;
  amount: number;
}

export interface FeeDistributionRecord {
  distributedAt: string;
  txHash: string;
  data: TokenFeeInfo[];
}
export interface FeeDistributionInfo {
  veVRTK: FeeDistributionRecord;
  treasury: FeeDistributionRecord;
  stableGaugeFund: FeeDistributionRecord;
}
