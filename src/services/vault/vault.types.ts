import { BigNumber, BigNumberish, ethers } from 'ethers';

export enum JoinKind {
  INIT,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
  ALL_TOKENS_IN_FOR_EXACT_BPT_OUT,
}

export const EXACT_BPT_IN_FOR_ONE_TOKEN_OUT = 0;

export enum ExitKindWeighted {
  /**
   * Single Asset Exit
   * User sends a precise quantity of BPT, and receives an estimated but unknown (computed at run time) quantity of a single token.
   */
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,

  /**
   * Proportional Exit. User sends a precise quantity of BPT, and receives an estimated but unknown (computed at run time) quantities of all tokens.
   */
  EXACT_BPT_IN_FOR_TOKENS_OUT,

  /**
   * Custom Exit
   * User sends an estimated but unknown (computed at run time) quantity of BPT, and receives precise quantities of specified tokens.
   */
  BPT_IN_FOR_EXACT_TOKENS_OUT,

  MANAGEMENT_FEE_TOKENS_OUT, // for InvestmentPool
}

export enum ExitKindStable {
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
  EXACT_BPT_IN_FOR_TOKENS_OUT,
  BPT_IN_FOR_EXACT_TOKENS_OUT,
}

export enum PoolType {
  Weighted = 'Weighted',
  Stable = 'Stable',
  ComposableStable = 'ComposableStable',
  LiquidityBootstrappingPool = 'LiquidityBootstrappingPool',
}

export const JOIN_KIND_INIT = 0; // Can only be called once for most pools

// export interface ExitPoolRequest {
//   tokens: string[];
//   minAmountsOut: BigNumber[];
//   toInternalBalance: boolean;
// }

// export interface JoinPoolRequest {
//   assets: string[];
//   maxAmountsIn: BigNumber[];
//   userData: string; // ABI encoded data
//   fromInternalBalance: boolean;
// }

export enum PoolSpecialization {
  GeneralPool = 0,
  MinimalSwapInfoPool = 1,
  TwoTokenPool = 2,
}

export type FundManagement = {
  sender: string;
  fromInternalBalance: boolean;
  recipient: string;
  toInternalBalance: boolean;
};

export enum SwapKind {
  GivenIn = 0,
  GivenOut = 1,
}

export type SingleSwap = {
  poolId: string;
  kind: SwapKind;
  assetIn: string;
  assetOut: string;
  amount: BigNumberish;
  userData: string;
};

export type Swap = {
  kind: SwapKind;
  singleSwap: SingleSwap;
  limit: BigNumberish;
  deadline: BigNumberish;
};

export type BatchSwapStep = {
  poolId: string;
  assetInIndex: number;
  assetOutIndex: number;
  amount: BigNumberish;
  userData: string;
};

export type BatchSwap = {
  kind: SwapKind;
  swaps: BatchSwapStep[];
  assets: string[];
  funds: FundManagement;
  limits: BigNumberish[];
  deadline: BigNumberish;
};

export type SwapRequest = {
  kind: SwapKind;
  tokenIn: string;
  tokenOut: string;
  amount: BigNumberish;
  poolId: string;
  lastChangeBlock: BigNumberish;
  from: string;
  to: string;
  userData: string;
};

export type JoinPoolRequest = {
  assets: string[];
  maxAmountsIn: BigNumberish[];
  userData: string;
  fromInternalBalance: boolean;
};

export type ExitPoolRequest = {
  assets: string[];
  minAmountsOut: BigNumberish[];
  userData: string;
  toInternalBalance: boolean;
};

export enum UserBalanceOpKind {
  DepositInternal = 0,
  WithdrawInternal = 1,
  TransferInternal = 2,
  TransferExternal = 3,
}

export type UserBalanceOp = {
  kind: UserBalanceOpKind;
  asset: string;
  amount: BigNumberish;
  sender: string;
  recipient: string;
};
export enum PoolBalanceOpKind {
  Withdraw = 0,
  Deposit = 1,
  Update = 2,
}

export type PoolBalanceOp = {
  kind: PoolBalanceOpKind;
  poolId: string;
  token: string;
  amount: BigNumberish;
};

export enum GaugeType {
  LiquidityMiningCommittee = 0,
  veBAL = 1,
  Ethereum = 2,
  veVRTK = 3,
}

export type QueryBatchSwap = {
  kind: number;
  swaps: BatchSwapStep[];
  assets: string[];
  funds: FundManagement;
};

export enum ProtocolFee {
  SWAP = 0,
  FLASH_LOAN = 1,
  YIELD = 2,
  AUM = 3,
}
