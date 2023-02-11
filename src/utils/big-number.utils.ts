import { BigNumber } from 'ethers';
import { defaultAbiCoder, formatEther } from 'ethers/lib/utils';

export function ethNum(bn: BigNumber) {
  return Number(formatEther(bn));
}

export function encodeAbiAndData(abi: string[], data: any[]) {
  return defaultAbiCoder.encode(abi, data);
}
