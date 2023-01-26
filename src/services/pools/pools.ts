import { Contract, ContractReceipt } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { CreateWeightedPoolArgs } from 'src/types/pool.types';
import { getSigner } from 'src/utils/account.util';
import {
  getContractAddress,
  getWeightedPoolToken,
} from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import {
  completeWeightedSetup,
  createConfigWeightedPool,
  doPoolInitJoin,
} from './pool-creation';
import { getAllPoolConfigs } from './pool.utils';

export async function runPoolsSetup() {
  const pools = await getAllPoolConfigs();
  let i = 1;
  for (const pool of pools) {
    try {
      await createConfigWeightedPool(i);
    } catch (error) {
      logger.error(`Error creating pool "${pool.deploymentArgs.name}"`);
    }

    i++;
  }
}

export async function runInitJoins() {
  const pools = await getAllPoolConfigs();
  for (const pool of pools) {
    try {
      if (pool.initJoinComplete) {
        logger.warn(`Pool "${pool.name}" init join already complete`);
        continue;
      }

      await doPoolInitJoin(pool);
    } catch (error) {
      logger.error(`Error running init join for "${pool.deploymentArgs.name}"`);
    }
  }
}
