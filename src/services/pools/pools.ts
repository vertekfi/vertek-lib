import { logger } from 'src/utils/logger';
import { createConfigWeightedPool, doPoolInitJoin } from './pool-creation';
import { getAllPoolConfigs } from './pool.utils';

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
