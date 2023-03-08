import { Contract } from 'ethers';
import { getSigner } from 'src/utils/account.util';
import { getContractAddress } from 'src/utils/contract.utils';
import { doTransaction } from 'src/utils/transaction.utils';
import * as managerAbi from '../../abis/BribeManager.json';
import * as merkleAbi from '../../abis/MerkleOrchard.json';

export async function getBribeManager() {
  return new Contract(
    getContractAddress('BribeManager'),
    managerAbi,
    await getSigner(),
  );
}

export async function getMerkleOrchard() {
  return new Contract(
    getContractAddress('MerkleOrchard'),
    merkleAbi,
    await getSigner(),
  );
}

export async function addBribeGauges(gauges: string[]) {
  const manager = await getBribeManager();
  await doTransaction(manager.addGauges(gauges));
}

export async function addBribeTokenOptions(tokens: string[]) {
  const manager = await getBribeManager();
  await doTransaction(manager.addWhiteListTokens(tokens));
}
