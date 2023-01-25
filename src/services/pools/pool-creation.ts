import { Contract, ContractReceipt } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import {
  CreateWeightedPoolArgs,
  PoolCreationConfig,
  PoolType,
} from 'src/types/pool.types';
import { _require } from 'src/utils';
import { getSigner, getSignerAddress } from 'src/utils/account.util';
import {
  getContractAddress,
  getWeightedPoolToken,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import { getActionId } from '../auth/action-ids';
import { grantVaultAuthorizerPermissions } from '../auth/auth';
import {
  getAllPoolConfigs,
  getDexPoolDataConfig,
  getMainPoolConfig,
  getPoolCreationData,
  getWeightedPoolArgsFromConfig,
  initWeightedJoin,
  updateDexPoolDataConfig,
  updatePoolConfig,
  validatePoolConfig,
} from './pool.utils';

export async function createMainPool() {
  const pool = await getMainPoolConfig();

  validatePoolConfig(pool);

  await createConfigWeightedPool(0);
}

export async function createConfigWeightedPool(poolConfigIndex: number) {
  const pools = await getAllPoolConfigs();
  const pool = pools[poolConfigIndex];

  if (!pool) {
    logger.error(`Invalis poolConfigIndex: ${poolConfigIndex}`);
    return;
  }

  if (pool.created) {
    logger.error(`Pool ${pool.name} already created`);
    return;
  }

  if (!pool.deploymentArgs.owner) {
    logger.warn(
      `No owner set for pool "${pool.name}". Assigning local account as owner`,
    );

    pool.deploymentArgs.owner = await getSignerAddress();
    await updatePoolConfig(pool);
  }

  validatePoolConfig(pool);

  // use util to format deployment args properly
  const args = getWeightedPoolArgsFromConfig(pool, await getSignerAddress());
  pool.deploymentArgs = args;
  await updatePoolConfig(pool);

  // create the pool contract
  const receipt = await createWeightedPool(args);

  // update local data for pool
  pool.created = true;
  pool.txHash = receipt.transactionHash;
  pool.deploymentArgs = {
    ...pool.deploymentArgs,
    ...args,
  };
  pool.name = pool.deploymentArgs.name;
  pool.symbol = pool.deploymentArgs.symbol;
  await updatePoolConfig(pool);

  // Will have to etherscan it or run a function over the txHash after a delay
  const poolData = await tryGetPoolAddressFromReceipt(receipt);
  if (!poolData.poolAddress) {
    pool.txHash = poolData.txHash;
    await updatePoolConfig(pool);
    return;
  }

  await updatePoolConfig({
    ...pool,
    ...poolData,
  });

  await completeWeightedSetup(poolData.poolAddress);
}

export async function completeWeightedSetup(poolAddress: string) {
  const pools = await getAllPoolConfigs();
  let pool = pools.find((p) => p.poolAddress === poolAddress);

  _require(!!pool, 'Pool not found');

  const poolData = await getPoolCreationData(poolAddress);
  if (!poolData) {
    return;
  }

  await updatePoolConfig({
    ...pool,
    ...poolData,
  });

  // Add auth permissions for pause
  // const poolInstance = await getWeightedPoolToken(pool.poolAddress);
  // const action = await getActionId(poolInstance, 'pause');
  // await grantVaultAuthorizerPermissions([action], [pool.poolAddress]);
}

export async function doPoolInitJoin(pool: PoolCreationConfig) {
  await initWeightedJoin(
    pool.poolId,
    pool.deploymentArgs.tokens,
    pool.deploymentArgs.initialBalances,
    await getSignerAddress(),
  );

  pool.initJoinComplete = true;
  pool = await updatePoolConfig(pool);
}

async function tryGetPoolAddressFromReceipt(receipt: ContractReceipt) {
  try {
    const poolAddress = receipt.events[0].address;
    console.log('poolAddress: ' + poolAddress);
    const poolId = receipt.events[1].topics[1];
    console.log('poolId: ' + poolId);
    return {
      txHash: receipt.transactionHash,
      poolId,
      poolAddress,
      date: new Date().toLocaleString(),
    };
  } catch (error) {
    logger.error(`Unable to get pool address`);
    // console.log(receipt.events);
    return {
      txHash: receipt.transactionHash,
      date: new Date().toLocaleString(),
    };
  }
}

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
