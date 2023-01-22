import { Contract } from 'ethers';
import { CONTRACT_MAP } from 'src/data/vertek/contracts';

import * as TokenAdminAbi from '../abis/BalancerTokenAdmin.json';
import * as TimelockAuthAbi from '../abis/TimelockAuthorizer.json';
import * as AuthEntrypointAbi from '../abis/AuthorizerAdapterEntrypoint.json';
import * as AuthAdapterAbi from '../abis/AuthorizerAdaptor.json';
import * as Vaultbi from '../abis/Vault.json';
import * as GovTokenAbi from '../abis/GovernanceToken.json';
import * as MinterAbi from '../abis/BalancerMinter.json';
import * as GaugeControllerAbi from '../abis/GaugeController.json';
import * as VeAbi from '../abis/VotingEscrow.json';
import * as GaugeAbi from '../abis/LiquidityGaugeV5.json';
import * as GaugeAdderAbi from '../abis/GaugeAdder.json';

import { getChainId, getSigner } from './account.util';
import { ERC20_ABI } from 'src/abis/ERC20ABI';
import { TOKENS } from 'src/data/token';

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

export async function getGovToken() {
  return new Contract(getTokenAddress('VRTK'), GovTokenAbi, await getSigner());
}

export async function getVault() {
  return new Contract(getContractAddress('Vault'), Vaultbi, await getSigner());
}

export async function getBalMinter() {
  return new Contract(
    getContractAddress('BalancerMinter'),
    MinterAbi,
    await getSigner(),
  );
}

export async function getGaugeController() {
  return new Contract(
    getContractAddress('GaugeController'),
    GaugeControllerAbi,
    await getSigner(),
  );
}

export async function getVotingEscrow() {
  return new Contract(
    getContractAddress('VotingEscrow'),
    VeAbi,
    await getSigner(),
  );
}

export async function getERC20(address: string) {
  return new Contract(address, ERC20_ABI, await getSigner());
}

export async function getLiquidityGaugeTemplate() {
  return new Contract(
    getContractAddress('LiquidityGaugeV5'),
    GaugeAbi,
    await getSigner(),
  );
}

export async function getGaugeAdder() {
  return new Contract(
    getContractAddress('GaugeAdder'),
    GaugeAdderAbi,
    await getSigner(),
  );
}

/**
 * Gets a contract address for the current chain id.
 * @param contractName
 * @returns
 */
export function getContractAddress(contractName: string): string {
  // TODO: maybe type this
  const address = CONTRACT_MAP[contractName]
    ? CONTRACT_MAP[contractName][getChainId()]
    : null;
  if (!address) {
    throw new Error(`No address for contract: ${contractName}`);
  }

  return address;
}

/**
 * Gets a token address for the current chain id.
 * @param tokenName
 * @returns
 */
export function getTokenAddress(tokenName: string): string {
  const address = TOKENS[tokenName] ? TOKENS[tokenName][getChainId()] : null;
  if (!address) {
    throw new Error(`No address for contract: ${tokenName}`);
  }

  return address;
}

export function getSighash(instance: Contract, method: string) {
  return instance.interface.getSighash(method);
}
