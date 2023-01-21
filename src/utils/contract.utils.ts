import { Contract } from 'ethers';
import { CONTRACT_MAP } from 'src/data/contracts';

import * as TokenAdminAbi from '../abis/BalancerTokenAdmin.json';
import * as TimelockAuthAbi from '../abis/TimelockAuthorizer.json';
import * as AuthEntrypointAbi from '../abis/AuthorizerAdapterEntrypoint.json';
import * as AuthAdapterAbi from '../abis/AuthorizerAdaptor.json';
import { getChainId, getSigner } from './account.util';

export async function getTokenAdmin() {
  return new Contract(
    getContractAddress('BalancerTokenAdmin'),
    TokenAdminAbi,
    await getSigner(),
  );
}

export async function getTimelockAuthorizer() {
  return new Contract(
    getContractAddress('TimelockAuthorizer'),
    TimelockAuthAbi,
    await getSigner(),
  );
}

export async function getAuthAdapterEntrypoint() {
  return new Contract(
    getContractAddress('AuthorizerAdaptorEntrypoint'),
    AuthEntrypointAbi,
    await getSigner(),
  );
}

export async function getAuthorizerAdapter() {
  return new Contract(
    getContractAddress('AuthorizerAdaptor'),
    AuthAdapterAbi,
    await getSigner(),
  );
}

/**
 * Gets a contract address for the current chain id.
 * @param contractName
 * @returns
 */
export function getContractAddress(contractName: string): string {
  // TODO: type this
  const address = CONTRACT_MAP[contractName][getChainId()];
  if (!address) {
    throw new Error(`No address for contract: ${contractName}`);
  }

  return address;
}

export function getSighash(instance: Contract, method: string) {
  return instance.interface.getSighash(method);
}
