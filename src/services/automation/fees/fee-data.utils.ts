import { join } from 'path';
import * as fs from 'fs-extra';
import { FeePoolWithdrawConfig } from './fee.types';
import {
  GqlProtocolFeesCollectorAmounts,
  GqlProtocolPendingGaugeFee,
} from 'src/services/subgraphs/vertek/generated/vertek-subgraph-types';
import { logger } from 'src/utils/logger';

const basePath = join(process.cwd(), 'src/data/vertek/fees/');

const feePoolConfigPath = join(basePath, 'fee-automation.config.json');

const gaugeFeeDataPath = join(basePath, 'gauges');
const poolsFeeDataPath = join(basePath, 'pool-fees');

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

export function saveGaugeFeesData(data: any[]) {
  fs.writeJSONSync(join(gaugeFeeDataPath, `${Date.now()}.json`), {
    datetime: new Date().toUTCString(),
    data,
  });

  logger.success(`saveGaugeFeesData complete`);
}

export function saveProtocolFeesData(data: GqlProtocolFeesCollectorAmounts[]) {
  fs.writeJSONSync(join(poolsFeeDataPath, `${Date.now()}.json`), {
    datetime: new Date().toUTCString(),
    data,
  });

  logger.success(`saveProtocolFeesData complete`);
}
