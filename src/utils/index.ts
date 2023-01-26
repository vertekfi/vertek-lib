import { ethers } from 'ethers';

export * from './numbers';

export function _require(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

export const ZERO = ethers.constants.Zero;
