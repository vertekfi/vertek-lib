import { Contract, ContractReceipt } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { CreateWeightedPoolArgs } from 'src/types/pool.types';
import { getSigner } from 'src/utils/account.util';
import { getContractAddress } from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';

export async function createWeightedPool(
  args: CreateWeightedPoolArgs,
): Promise<ContractReceipt> {
  logger.info('createWeightedPool: creating pool...');
  const factory = new Contract(
    getContractAddress('WeightedPoolFactory'),
    [
      `function create(
      string  name,
      string  symbol,
      address[]  tokens,
      uint256[]  normalizedWeights,
      address[]  rateProviders,
      uint256 swapFeePercentage,
      address owner
  ) external returns (address) `,
    ],
    await getSigner(),
  );

  const tx = await factory.create(
    args.name,
    args.symbol,
    args.tokens,
    args.weights.map((w) => parseUnits(w)),
    args.rateProviders,
    parseUnits(args.swapFeePercentage),
    args.owner,
  );

  return await awaitTransactionComplete(tx);
}

export async function getPoolCreationData(poolAddress: string) {
  try {
    const pool = new Contract(
      poolAddress,
      ['function getPoolId() public view returns (bytes32)'],
      await getSigner(),
    );

    const data = {
      poolId: await pool.getPoolId(),
      poolAddress,
      // txHash: receipt.transactionHash,
      date: new Date().toLocaleString(),
    };

    console.log(data);

    return data;
  } catch (error) {
    logger.error(`getPoolCreationData:`, error);
    return null;
  }
}
