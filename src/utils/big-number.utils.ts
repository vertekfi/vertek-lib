import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

export function ethNum(bn: BigNumber) {
  return Number(formatEther(bn));
}
