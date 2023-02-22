import { join } from 'path';
import * as fs from 'fs-extra';
import { FeePoolWithdrawConfig } from './fee.types';
import {
  GqlProtocolFeesCollectorAmounts,
  GqlProtocolPendingGaugeFee,
} from 'src/services/subgraphs/vertek/generated/vertek-subgraph-types';
import { logger } from 'src/utils/logger';
import {
  VE_FEE_EXCLUDED_POOL_IDS,
  VE_HOLDER_FEE_PERCENT,
  VRTK_BNB_POOL_ID,
} from 'src/data/vertek/constants/fees';
import * as moment from 'moment-timezone';

export const baseFeeDataPath = join(process.cwd(), 'src/data/vertek/fees/');
const feePoolConfigPath = join(baseFeeDataPath, 'fee-automation.config.json');
export const gaugeFeeDataPath = join(baseFeeDataPath, 'gauges');
export const poolsFeeDataPath = join(baseFeeDataPath, 'pool-fees');
export const feeDistributionsPath = join(baseFeeDataPath, 'distributions');

interface FeeSavedDataFormat<T> {
  datetime: string;
  data: T[];
}

function getJoinedPath(base: string, ext: string) {
  return join(base, ext);
}

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

export function saveFeeDistributionData(
  data: { amount: string; usdValue: string; txHash: string }[],
) {
  fs.writeJSONSync(join(poolsFeeDataPath, `${Date.now()}.json`), {
    datetime: new Date().toUTCString(),
    data,
  });

  logger.success(`saveProtocolFeesData complete`);
}

export function getGaugeFeeDistributionAmounts() {
  const dir = fs.readdirSync(gaugeFeeDataPath);

  const currentFeeFile = dir[dir.length - 1];

  const currentFeeData: FeeSavedDataFormat<GqlProtocolPendingGaugeFee> =
    fs.readJSONSync(getJoinedPath(gaugeFeeDataPath, currentFeeFile));

  console.log(currentFeeData.data.filter((d) => d.amount > 0));

  const feeItems = currentFeeData.data.filter(
    (d) =>
      !VE_FEE_EXCLUDED_POOL_IDS.includes(d.poolId) &&
      d.amount > 0 &&
      d.poolId !== VRTK_BNB_POOL_ID,
  );

  console.log(feeItems);
  logger.info(`Calculating fee amounts for ${feeItems.length} fee items`);

  let totalValueUSD = 0;
  const amounts = feeItems.map((itm) => {
    const valueUSD = itm.valueUSD * VE_HOLDER_FEE_PERCENT;
    totalValueUSD += valueUSD;
    return {
      ...itm,
      amount: itm.amount * VE_HOLDER_FEE_PERCENT,
      valueUSD,
    };
  });

  return {
    totalValueUSD,
    amounts,
  };
}

export function createWeekDataDirectory() {
  const range = moment().utc();
  const dirName = getEpochRangeLabel(
    moment(range).utc().subtract(6, 'days').unix(),
    range.unix(),
  );

  const dirPath = join(baseFeeDataPath, dirName);
  fs.ensureDirSync(dirPath);

  return dirPath;
}

export function getEpochRangeLabel(
  startTimestamp: number,
  endTimestamp: number,
) {
  return `${moment.unix(startTimestamp).utc().format('yyyyMMDD')}-${moment
    .unix(endTimestamp)
    .utc()
    .format('yyyyMMDD')}`;
}
