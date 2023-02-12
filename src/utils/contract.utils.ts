import { Contract } from 'ethers';
import { CONTRACT_MAP } from 'src/data/vertek/addresses/contracts';

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
import * as GaugeFactoryAbi from '../abis/LiquidityGaugeFactory.json';
import * as PoolTokenAbi from '../abis/BalancerPoolToken.json';
import * as WeightedPoolAbi from '../abis/WeightedPool.json';
import * as WeightedPoolFactoryAbi from '../abis/WeightedPoolFactory.json';
import * as FeeCollectorAbi from '../abis/ProtocolFeesCollector.json';
import * as SingleRecipientAbi from '../abis/SingleRecipientGauge.json';
import * as FeeDistAbi from '../abis/FeeDistributor.json';

import { getChainId, getRpcProvider, getSigner } from './account.util';
import { ERC20_ABI } from 'src/abis/ERC20ABI';
import { TOKENS } from 'src/data/token';
import { getAllPoolConfigs } from 'src/services/pools/pool.utils';
import { Multicaller } from 'src/services/standalone-utils/multicaller';

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

export async function getVaultV1() {
  return new Contract(
    getContractAddress('Vault_V1'),
    Vaultbi,
    await getSigner(),
  );
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

export async function getBalancerPoolToken(address: string) {
  return new Contract(address, PoolTokenAbi, await getSigner());
}

export async function getWeightedPoolToken(address: string) {
  return new Contract(address, WeightedPoolAbi, await getSigner());
}

export async function getWeightedPoolFactory() {
  return new Contract(
    getContractAddress('WeightedPoolFactory'),
    WeightedPoolFactoryAbi,
    await getSigner(),
  );
}

export async function getLiquidityGaugeTemplate() {
  return new Contract(
    getContractAddress('LiquidityGaugeV5'),
    GaugeAbi,
    await getSigner(),
  );
}
export async function getLiquidityGaugeInstance(address: string) {
  return new Contract(address, GaugeAbi, await getSigner());
}

export async function getLiquidityGaugeFactory() {
  return new Contract(
    getContractAddress('LiquidityGaugeFactory'),
    GaugeFactoryAbi,
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
 * @param symbol
 * @returns
 */
export function getTokenAddress(symbol: string): string {
  const address = TOKENS[symbol] ? TOKENS[symbol][getChainId()] : null;
  if (!address) {
    throw new Error(`No address for contract: ${symbol}`);
  }

  return address;
}

export async function getAllPoolsWithGauges() {
  const pools = await getAllPoolConfigs();
  return pools.filter((p) => p.gauge && p.gauge.address);
}

export async function getNextPoolIndex() {
  return (await getAllPoolConfigs()).length - 1;
}

export async function getMulticaller(abi: any[]) {
  return new Multicaller(
    getContractAddress('Multicall'),
    await getRpcProvider(),
    abi,
  );
}

export async function getProtocolFeesCollector() {
  return new Contract(
    getContractAddress('ProtocolFeesCollector'),
    FeeCollectorAbi,
    await getSigner(),
  );
}

export async function getSingleRecipientGauge() {
  return new Contract(
    getContractAddress('SingleRecipientGauge'),
    SingleRecipientAbi,
    await getSigner(),
  );
}

export async function getFeeDistributor() {
  return new Contract(
    getContractAddress('FeeDistributor'),
    FeeDistAbi,
    await getSigner(),
  );
}
