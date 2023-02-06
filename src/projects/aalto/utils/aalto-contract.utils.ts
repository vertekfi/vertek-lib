import { Contract } from 'ethers';
import { ChainProvider } from 'src/types/account.types';
import {
  getAccountSigner,
  getChainId,
  getChainProvider,
} from 'src/utils/account.util';
import { getTokenAddress } from 'src/utils/contract.utils';

import * as AaltoAbi from '../abis/Aalto.json';
import * as wAaltoAbi from '../abis/WrappedAalto.json';

export async function getAalto() {
  return new Contract(
    getTokenAddress('AALTO'),
    AaltoAbi,
    await getAaltoAccountSigner(),
  );
}

// Owned by separate account
export async function getWrappedAalto() {
  return new Contract(
    getTokenAddress('wAALTO'),
    wAaltoAbi,
    await getAccountSigner('DEV_KEY'),
  );
}

let aaltoDevAccount: ChainProvider;

export async function getDevAccountAalto() {
  if (aaltoDevAccount) {
    return aaltoDevAccount;
  }
  aaltoDevAccount = await getChainProvider(getChainId(), 'AALTO_DEV_KEY');
  return aaltoDevAccount;
}

export async function getAaltoAccountSigner() {
  return (await getDevAccountAalto()).signer;
}
