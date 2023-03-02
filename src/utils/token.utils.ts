import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { Multicaller } from 'src/services/standalone-utils/multicaller';
import { getRpcProvider, getSignerAddress } from './account.util';
import { MAX_UINT256 } from './constants';
import { getContractAddress, getERC20, getMulticaller } from './contract.utils';
import { logger } from './logger';
import { awaitTransactionComplete } from './transaction.utils';

export function mapTokensToAddressObjectMap(tokens: string[]) {
  return tokens.map((t) => {
    return {
      address: t,
    };
  });
}

export async function approveTokensIfNeeded(
  tokens: string[],
  owner: string,
  spender: string,
) {
  try {
    logger.info(`Checking token allowances..`);

    const multicall = await getMulticaller([
      'function allowance(address, address) public view returns (uint256)',
    ]);

    tokens.forEach((token) => {
      multicall.call(`${token}.allowance`, token, 'allowance', [
        owner,
        spender,
      ]);
    });

    const allowances = await multicall.execute<
      Record<string, { allowance: BigNumber }>
    >('approveTokensIfNeeded');

    for (const record of Object.entries(allowances)) {
      const [token, info] = record;

      if (info.allowance.isZero()) {
        logger.info(`Approving token: ${token} - for spender ${spender}`);

        const erc20 = await getERC20(token);
        await awaitTransactionComplete(
          await erc20.approve(spender, MAX_UINT256),
        );
        logger.success('Token approval complete');
      }
    }
  } catch (error) {
    logger.error('approveTokensIfNeeded failed');
    throw error;
  }
}

export async function getAccountTokenBalances(
  addressMap: { address: string }[],
  who: string,
  onlyNonZeroBalance: boolean,
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
