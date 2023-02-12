import { join } from 'path';
import * as fs from 'fs-extra';
import { FeePoolWithdrawConfig } from './fee.types';
import { vertekBackendClient } from 'src/services/subgraphs/vertek/vertek-backend-gql-client';

const feePoolConfigPath = join(
  process.cwd(),
  'src/data/vertek/fees/fee-automation.config.json',
);

export function getFeePoolConfigs(): FeePoolWithdrawConfig[] {
  return fs.readJSONSync(feePoolConfigPath);
}

export function getFeePoolConfig(poolId: string): FeePoolWithdrawConfig {
  return getConfig(getFeePoolConfigs(), poolId);
}

export function updateFeePoolConfig(
  poolId: string,
  data: FeePoolWithdrawConfig,
) {
  const configs = getFeePoolConfigs();
  const updated = Object.assign({}, getConfig(configs, poolId), data);
  configs[configs.indexOf(data)] = updated;

  fs.writeJSONSync(feePoolConfigPath, configs);
}

function getConfig(configs: FeePoolWithdrawConfig[], poolId: string) {
  const instance = configs.find((c) => c.poolId === poolId);
  if (!instance) {
    throw new Error(`Invalid fee config pool id: ${poolId}`);
  }

  return instance;
}
