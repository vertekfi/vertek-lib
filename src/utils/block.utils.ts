import { ChainProvider } from 'src/types/account.types';

export async function getCurrentBlockTimestamp({ provider }: ChainProvider) {
  return (await provider.getBlock(await provider.getBlockNumber())).timestamp;
}
