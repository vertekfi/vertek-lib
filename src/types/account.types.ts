import { ethers } from 'ethers';

export interface ChainProvider {
  signer?: ethers.Wallet;
  provider: ethers.providers.JsonRpcProvider;
  chainId: number;
  rpcUrl: string;
}
