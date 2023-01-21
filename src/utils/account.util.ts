import { ethers } from 'ethers';
import { ChainProvider } from 'src/types/account.types';

let chainProvider: ChainProvider;

const getAccount = async (): Promise<ChainProvider> => {
  if (chainProvider) {
    return chainProvider;
  }

  let rpcUrl = '';
  const chainId = parseInt(process.env.CHAIN_ID);
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
};

export function getChainId() {
  return parseInt(process.env.CHAIN_ID);
}

export async function getSigner() {
  return (await getAccount()).signer;
}
