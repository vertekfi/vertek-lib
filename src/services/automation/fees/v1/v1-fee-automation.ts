import { aequinoxClient } from 'src/services/subgraphs/aequinox/aequinox-backend.service';
import { logger } from 'src/utils/logger';

class V1FeeAutomation {
  constructor() {}

  async run() {
    try {
      logger.info('Starting V1 fee automation');
      const pools = await aequinoxClient.getPools();
    } catch (error) {
      console.error(error);
      logger.error('V1 fee automation failed');
    }
  }
}

export const v1FeeAutomation = new V1FeeAutomation();
