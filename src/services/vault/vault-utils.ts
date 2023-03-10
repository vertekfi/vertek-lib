import { BigNumber } from 'ethers';
import { encodeAbiAndData } from 'src/utils/big-number.utils';
import {
  BatchSwapStep,
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
  ExitKindWeighted,
  ExitPoolRequest,
} from './vault.types';

export function getDefaultSingleTokenExitRequest(
  tokens: string[],
  bptAmountIn: BigNumber,
  tokenOutIndex: number,
): ExitPoolRequest {
  return {
    assets: tokens,
    minAmountsOut: Array(tokens.length).fill(0),
    userData: encodeAbiAndData(
      ['uint256', 'uint256', 'uint256'],
      [EXACT_BPT_IN_FOR_ONE_TOKEN_OUT, bptAmountIn, tokenOutIndex],
    ),
    toInternalBalance: false,
  };
}

export function getDefaultAllTokensExitRequest(
  tokens: string[],
  bptAmountIn: BigNumber,
): ExitPoolRequest {
  return {
    assets: tokens,
    minAmountsOut: Array(tokens.length).fill(0),
    userData: encodeAbiAndData(
      ['uint256', 'uint256'],
      [ExitKindWeighted.EXACT_BPT_IN_FOR_TOKENS_OUT, bptAmountIn],
    ),
    toInternalBalance: false,
  };
}

export async function getDataForPoolExit(poolAddress: string) {
  // multicall things and parse, etc
}
