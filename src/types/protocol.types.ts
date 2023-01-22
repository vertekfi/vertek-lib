import { IRewardPool } from './pool.types';

export interface ProtocolPoolDataConfig {
  incentivizedPools: string[];
  featuredPools: string[];
  blacklistedPools: string[];
  poolFilters: string[];
  gauges: string[];
  rewardPools: IRewardPool[];
}
