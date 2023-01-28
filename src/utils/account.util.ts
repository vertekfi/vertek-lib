import { ethers } from 'ethers';
import { ChainProvider } from 'src/types/account.types';

let chainProvider: ChainProvider;

export const CHAIN_KEYS = {
  [5]: 'goerli',
  [56]: 'bsc',
};

export const getDefaultChainProvider = async (): Promise<ChainProvider> => {
  if (chainProvider) {
    return chainProvider;
  }

  return getChainProvider(parseInt(process.env.CHAIN_ID));
};

export async function getChainProvider(chainId: number) {
  let rpcUrl = '';
  if (chainId === 5) {
    rpcUrl = process.env.GOERLI_RPC;
  } else if (chainId === 56) {
    rpcUrl = process.env.BSC_RPC;
  } else {
    throw 'Chain id?';
  }

  if (!rpcUrl) {
    throw new Error('RPC URL not provided.');
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  await provider.ready;
  console.log('Using RPC: ' + rpcUrl);

  let signer = new ethers.Wallet(process.env.DEV_KEY);
  signer = signer.connect(provider);

  chainProvider = {
    provider,
    chainId,
    rpcUrl,
    signer,
  };

  return chainProvider;
}

export function getChainId() {
  return parseInt(process.env.CHAIN_ID);
}

export async function getSigner() {
  return (await getDefaultChainProvider()).signer;
}

export async function getSignerAddress() {
  return (await getSigner()).address;
}

export async function getBlockTimeStamp() {
  const { provider } = await getDefaultChainProvider();
  return (await provider.getBlock(await provider.getBlockNumber())).timestamp;
}
