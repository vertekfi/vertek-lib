import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { Multicaller } from 'src/services/standalone-utils/multicaller';
import { GqlProtocolFeesCollectorAmounts } from 'src/services/subgraphs/vertek/generated/vertek-subgraph-types';
import { getRpcProvider, getSignerAddress } from './account.util';
import { MAX_UINT256 } from './constants';
import { getContractAddress, getERC20 } from './contract.utils';
import { logger } from './logger';
import { awaitTransactionComplete } from './transaction.utils';

export async function approveTokensIfNeeded(
  tokens: string[],
  owner: string,
  spender: string,
) {
  try {
    logger.info(`Checking token allowances..`);
    for (const address of tokens) {
      const token = await getERC20(address);
      const allowance: BigNumber = await token.allowance(owner, spender);
      if (allowance.isZero()) {
        logger.info(`Approving token: ${address} - for spender ${spender}`);
        await awaitTransactionComplete(
          await token.approve(spender, MAX_UINT256),
        );
        logger.success('Token approval complete');
      }
    }
  } catch (error) {
    throw error;
  }
}

export async function getAccountTokenBalances(
  addressMap: { address: string }[],
  who?: string,
  onlyNonZeroBalance = true,
) {
  who = who || (await getSignerAddress());
  const multicall = new Multicaller(
    getContractAddress('Multicall'),
    await getRpcProvider(),
    ['function balanceOf(address) public view returns (uint256)'],
  );

  addressMap.forEach((d) =>
    multicall.call(`${d.address}.balanceBN`, d.address, 'balanceOf', [who]),
  );

  const balances = await multicall.execute<
    Record<string, { balanceBN: BigNumber }>
  >('getAccountPoolTokenBalances');

  const data = onlyNonZeroBalance
    ? Object.entries(balances).filter((bal) => !bal[1].balanceBN.isZero())
    : Object.entries(balances);

  const mapped = data.map((bal) => {
    return {
      address: bal[0],
      balanceBN: bal[1].balanceBN,
      balance: formatEther(bal[1].balanceBN),
    };
  });

  return mapped;
}

export async function getBalanceForToken(token: string, who?: string) {
  const instance = await getERC20(token);
  const balance: BigNumber = await instance.balanceOf(
    who || (await instance.signer.getAddress()),
  );
  console.log(`Balance for ${token}: ${formatEther(balance)}`);
  return balance;
}

export function sortTokenObjects(addies: { address: string }[]) {
  return addies.sort((a1, a2) =>
    a1.address.toLowerCase() < a2.address.toLowerCase() ? -1 : 1,
  );
}

export function sortTokens(tokens: string[]) {
  return tokens.sort((a1, a2) =>
    a1.toLowerCase() < a2.toLowerCase() ? -1 : 1,
  );
}

export function sortAndGetTokenIndex(tokens: string[], targetAddress: string) {
  const sortedTokens = sortTokens(tokens);

  return {
    sortedTokens,
    targetIndex: sortedTokens.indexOf(targetAddress),
  };
}
