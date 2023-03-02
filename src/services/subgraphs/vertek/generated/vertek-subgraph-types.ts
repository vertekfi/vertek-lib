import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AmountHumanReadable: any;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
  Date: any;
  GqlBigNumber: any;
  JSON: any;
};

export type GaugeBribe = {
  __typename?: 'GaugeBribe';
  amount: Scalars['String'];
  briber: Scalars['String'];
  epochStartTime: Scalars['Int'];
  epochWeekLabel: Scalars['String'];
  gauge: Scalars['String'];
  token: GqlToken;
  valueUSD: Scalars['Float'];
};

export type GaugeFactory = {
  __typename?: 'GaugeFactory';
  id: Scalars['String'];
};

export type GaugePool = {
  __typename?: 'GaugePool';
  address: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  poolType: Scalars['String'];
  tokens: Array<GqlPoolToken>;
  tokensList: Array<Scalars['String']>;
};

export type GaugeShare = {
  __typename?: 'GaugeShare';
  /**  User's balance of gauge deposit tokens  */
  balance: Scalars['BigDecimal'];
  /**  Equal to: <userAddress>-<gaugeAddress>  */
  id: Scalars['ID'];
  /**  Reference to User entity  */
  user: User;
};

export type GaugeType = {
  __typename?: 'GaugeType';
  /**  Type ID  */
  id: Scalars['ID'];
  /**  Name of the type - empty string if call reverts  */
  name: Scalars['String'];
};

export type GaugeVote = {
  __typename?: 'GaugeVote';
  /**  Equal to: <userAddress>-<gaugeAddress>  */
  id: Scalars['ID'];
  /**  Timestamp at which user voted [seconds]  */
  timestamp?: Maybe<Scalars['BigInt']>;
  /**  Reference to User entity  */
  user: User;
  /**  Weight of veBAL power user has used to vote  */
  weight?: Maybe<Scalars['BigDecimal']>;
};

export type GqlAllFeesData = {
  __typename?: 'GqlAllFeesData';
  feeCollector: GqlFeesCollectorAmountsResult;
  gauges: GqlPendingGaugeFeeResult;
  totalValueUSD: Scalars['Float'];
};

export type GqlBalancePoolAprItem = {
  __typename?: 'GqlBalancePoolAprItem';
  apr: Scalars['BigDecimal'];
  id: Scalars['ID'];
  subItems?: Maybe<Array<GqlBalancePoolAprSubItem>>;
  title: Scalars['String'];
};

export type GqlBalancePoolAprSubItem = {
  __typename?: 'GqlBalancePoolAprSubItem';
  apr: Scalars['BigDecimal'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type GqlContentNewsItem = {
  __typename?: 'GqlContentNewsItem';
  discussionUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  source: GqlContentNewsItemSource;
  text: Scalars['String'];
  timestamp: Scalars['String'];
  url: Scalars['String'];
};

export enum GqlContentNewsItemSource {
  Discord = 'discord',
  Medium = 'medium',
  Twitter = 'twitter',
}

export type GqlFeaturePoolGroupItemExternalLink = {
  __typename?: 'GqlFeaturePoolGroupItemExternalLink';
  buttonText: Scalars['String'];
  buttonUrl: Scalars['String'];
  id: Scalars['ID'];
  image: Scalars['String'];
};

export type GqlFeesCollectorAmountsResult = {
  __typename?: 'GqlFeesCollectorAmountsResult';
  totalValueUSD: Scalars['Float'];
  values: Array<Maybe<GqlProtocolFeesCollectorAmounts>>;
};

export type GqlHistoricalTokenPrice = {
  __typename?: 'GqlHistoricalTokenPrice';
  address: Scalars['String'];
  prices: Array<GqlHistoricalTokenPriceEntry>;
};

export type GqlHistoricalTokenPriceEntry = {
  __typename?: 'GqlHistoricalTokenPriceEntry';
  price: Scalars['Float'];
  timestamp: Scalars['String'];
};

export type GqlLatestSyncedBlocks = {
  __typename?: 'GqlLatestSyncedBlocks';
  poolSyncBlock: Scalars['BigInt'];
  userStakeSyncBlock: Scalars['BigInt'];
  userWalletSyncBlock: Scalars['BigInt'];
};

export type GqlPendingGaugeFeeResult = {
  __typename?: 'GqlPendingGaugeFeeResult';
  totalValueUSD: Scalars['Float'];
  values: Array<Maybe<GqlProtocolPendingGaugeFee>>;
};

export type GqlPoolApr = {
  __typename?: 'GqlPoolApr';
  hasRewardApr: Scalars['Boolean'];
  items: Array<GqlBalancePoolAprItem>;
  max?: Maybe<Scalars['BigDecimal']>;
  min?: Maybe<Scalars['BigDecimal']>;
  nativeRewardApr: Scalars['BigDecimal'];
  swapApr: Scalars['BigDecimal'];
  thirdPartyApr: Scalars['BigDecimal'];
  total: Scalars['BigDecimal'];
};

export type GqlPoolAprItem = {
  __typename?: 'GqlPoolAprItem';
  apr: Scalars['BigDecimal'];
  subItems?: Maybe<Array<GqlBalancePoolAprSubItem>>;
  title: Scalars['String'];
};

export type GqlPoolAprSubItem = {
  __typename?: 'GqlPoolAprSubItem';
  apr: Scalars['BigDecimal'];
  title: Scalars['String'];
};

export type GqlPoolBase = {
  address: Scalars['Bytes'];
  allTokens: Array<GqlPoolTokenExpanded>;
  createTime: Scalars['Int'];
  decimals: Scalars['Int'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String'];
  owner?: Maybe<Scalars['Bytes']>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolBatchSwap = {
  __typename?: 'GqlPoolBatchSwap';
  id: Scalars['ID'];
  swaps: Array<GqlPoolBatchSwapSwap>;
  timestamp: Scalars['Int'];
  tokenAmountIn: Scalars['String'];
  tokenAmountOut: Scalars['String'];
  tokenIn: Scalars['String'];
  tokenInPrice: Scalars['Float'];
  tokenOut: Scalars['String'];
  tokenOutPrice: Scalars['Float'];
  tx: Scalars['String'];
  userAddress: Scalars['String'];
  valueUSD: Scalars['Float'];
};

export type GqlPoolBatchSwapPool = {
  __typename?: 'GqlPoolBatchSwapPool';
  id: Scalars['ID'];
  tokens: Array<Scalars['String']>;
};

export type GqlPoolBatchSwapSwap = {
  __typename?: 'GqlPoolBatchSwapSwap';
  id: Scalars['ID'];
  pool: GqlPoolMinimal;
  timestamp: Scalars['Int'];
  tokenAmountIn: Scalars['String'];
  tokenAmountOut: Scalars['String'];
  tokenIn: Scalars['String'];
  tokenOut: Scalars['String'];
  tx: Scalars['String'];
  userAddress: Scalars['String'];
  valueUSD: Scalars['Float'];
};

export type GqlPoolDynamicData = {
  __typename?: 'GqlPoolDynamicData';
  apr: GqlPoolApr;
  fees24h: Scalars['BigDecimal'];
  fees24hAth: Scalars['BigDecimal'];
  fees24hAthTimestamp: Scalars['Int'];
  fees24hAtl: Scalars['BigDecimal'];
  fees24hAtlTimestamp: Scalars['Int'];
  fees48h: Scalars['BigDecimal'];
  holdersCount: Scalars['BigInt'];
  lifetimeSwapFees: Scalars['BigDecimal'];
  lifetimeVolume: Scalars['BigDecimal'];
  poolId: Scalars['ID'];
  sharePriceAth: Scalars['BigDecimal'];
  sharePriceAthTimestamp: Scalars['Int'];
  sharePriceAtl: Scalars['BigDecimal'];
  sharePriceAtlTimestamp: Scalars['Int'];
  swapEnabled: Scalars['Boolean'];
  swapFee: Scalars['BigDecimal'];
  swapsCount: Scalars['BigInt'];
  totalLiquidity: Scalars['BigDecimal'];
  totalLiquidity24hAgo: Scalars['BigDecimal'];
  totalLiquidityAth: Scalars['BigDecimal'];
  totalLiquidityAthTimestamp: Scalars['Int'];
  totalLiquidityAtl: Scalars['BigDecimal'];
  totalLiquidityAtlTimestamp: Scalars['Int'];
  totalShares: Scalars['BigDecimal'];
  totalShares24hAgo: Scalars['BigDecimal'];
  volume24h: Scalars['BigDecimal'];
  volume24hAth: Scalars['BigDecimal'];
  volume24hAthTimestamp: Scalars['Int'];
  volume24hAtl: Scalars['BigDecimal'];
  volume24hAtlTimestamp: Scalars['Int'];
  volume48h: Scalars['BigDecimal'];
};

export type GqlPoolElement = GqlPoolBase & {
  __typename?: 'GqlPoolElement';
  address: Scalars['Bytes'];
  allTokens: Array<GqlPoolTokenExpanded>;
  baseToken: Scalars['Bytes'];
  createTime: Scalars['Int'];
  decimals: Scalars['Int'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String'];
  owner: Scalars['Bytes'];
  principalToken: Scalars['Bytes'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String'];
  tokens: Array<GqlPoolToken>;
  unitSeconds: Scalars['BigInt'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolFeaturedPoolGroup = {
  __typename?: 'GqlPoolFeaturedPoolGroup';
  icon: Scalars['String'];
  id: Scalars['ID'];
  items: Array<GqlPoolFeaturedPoolGroupItem>;
  title: Scalars['String'];
};

export type GqlPoolFeaturedPoolGroupItem =
  | GqlFeaturePoolGroupItemExternalLink
  | GqlPoolMinimal;

export type GqlPoolFilter = {
  categoryIn?: InputMaybe<Array<GqlPoolFilterCategory>>;
  categoryNotIn?: InputMaybe<Array<GqlPoolFilterCategory>>;
  filterIn?: InputMaybe<Array<Scalars['String']>>;
  filterNotIn?: InputMaybe<Array<Scalars['String']>>;
  idIn?: InputMaybe<Array<Scalars['String']>>;
  idNotIn?: InputMaybe<Array<Scalars['String']>>;
  poolTypeIn?: InputMaybe<Array<GqlPoolFilterType>>;
  poolTypeNotIn?: InputMaybe<Array<GqlPoolFilterType>>;
  tokensIn?: InputMaybe<Array<Scalars['String']>>;
  tokensNotIn?: InputMaybe<Array<Scalars['String']>>;
};

export enum GqlPoolFilterCategory {
  BlackListed = 'BLACK_LISTED',
  Incentivized = 'INCENTIVIZED',
}

export type GqlPoolFilterDefinition = {
  __typename?: 'GqlPoolFilterDefinition';
  id: Scalars['ID'];
  title: Scalars['String'];
};

export enum GqlPoolFilterType {
  Element = 'ELEMENT',
  Investment = 'INVESTMENT',
  Linear = 'LINEAR',
  LiquidityBootstrapping = 'LIQUIDITY_BOOTSTRAPPING',
  MetaStable = 'META_STABLE',
  PhantomStable = 'PHANTOM_STABLE',
  Stable = 'STABLE',
  Unknown = 'UNKNOWN',
  Weighted = 'WEIGHTED',
}

export type GqlPoolInvestConfig = {
  __typename?: 'GqlPoolInvestConfig';
  options: Array<GqlPoolInvestOption>;
  proportionalEnabled: Scalars['Boolean'];
  singleAssetEnabled: Scalars['Boolean'];
};

export type GqlPoolInvestOption = {
  __typename?: 'GqlPoolInvestOption';
  poolTokenAddress: Scalars['String'];
  poolTokenIndex: Scalars['Int'];
  tokenOptions: Array<GqlPoolToken>;
};

export type GqlPoolJoinExit = {
  __typename?: 'GqlPoolJoinExit';
  amounts: Array<GqlPoolJoinExitAmount>;
  id: Scalars['ID'];
  poolId: Scalars['String'];
  sender: Scalars['String'];
  timestamp: Scalars['Int'];
  tx: Scalars['String'];
  type: GqlPoolJoinExitType;
  valueUSD?: Maybe<Scalars['String']>;
};

export type GqlPoolJoinExitAmount = {
  __typename?: 'GqlPoolJoinExitAmount';
  address: Scalars['String'];
  amount: Scalars['String'];
};

export type GqlPoolJoinExitFilter = {
  poolIdIn?: InputMaybe<Array<Scalars['String']>>;
};

export enum GqlPoolJoinExitType {
  Exit = 'Exit',
  Join = 'Join',
}

export type GqlPoolLinear = GqlPoolBase & {
  __typename?: 'GqlPoolLinear';
  address: Scalars['Bytes'];
  allTokens: Array<GqlPoolTokenExpanded>;
  bptPriceRate?: Maybe<Scalars['BigDecimal']>;
  createTime: Scalars['Int'];
  decimals: Scalars['Int'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  investConfig: GqlPoolInvestConfig;
  lowerTarget: Scalars['BigInt'];
  mainIndex: Scalars['Int'];
  name: Scalars['String'];
  owner: Scalars['Bytes'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String'];
  tokens: Array<GqlPoolToken>;
  upperTarget: Scalars['BigInt'];
  withdrawConfig: GqlPoolWithdrawConfig;
  wrappedIndex: Scalars['Int'];
};

export type GqlPoolLinearNested = {
  __typename?: 'GqlPoolLinearNested';
  address: Scalars['Bytes'];
  bptPriceRate?: Maybe<Scalars['BigDecimal']>;
  createTime: Scalars['Int'];
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  lowerTarget: Scalars['BigInt'];
  mainIndex: Scalars['Int'];
  name: Scalars['String'];
  owner: Scalars['Bytes'];
  symbol: Scalars['String'];
  tokens: Array<GqlPoolToken>;
  totalLiquidity: Scalars['BigDecimal'];
  totalShares: Scalars['BigDecimal'];
  upperTarget: Scalars['BigInt'];
  wrappedIndex: Scalars['Int'];
};

export type GqlPoolLinearPoolData = {
  __typename?: 'GqlPoolLinearPoolData';
  address: Scalars['String'];
  balance: Scalars['String'];
  id: Scalars['ID'];
  mainToken: GqlPoolLinearPoolMainToken;
  mainTokenTotalBalance: Scalars['String'];
  poolToken: Scalars['String'];
  priceRate: Scalars['String'];
  symbol: Scalars['String'];
  totalSupply: Scalars['String'];
  unwrappedTokenAddress: Scalars['String'];
  wrappedToken: GqlPoolLinearPoolWrappedToken;
};

export type GqlPoolLinearPoolMainToken = {
  __typename?: 'GqlPoolLinearPoolMainToken';
  address: Scalars['String'];
  balance: Scalars['String'];
  decimals: Scalars['Int'];
  index: Scalars['Int'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  totalSupply: Scalars['String'];
};

export type GqlPoolLinearPoolWrappedToken = {
  __typename?: 'GqlPoolLinearPoolWrappedToken';
  address: Scalars['String'];
  balance: Scalars['String'];
  decimals: Scalars['Int'];
  index: Scalars['Int'];
  name: Scalars['String'];
  priceRate: Scalars['String'];
  symbol: Scalars['String'];
  totalSupply: Scalars['String'];
};

export type GqlPoolLiquidityBootstrapping = GqlPoolBase & {
  __typename?: 'GqlPoolLiquidityBootstrapping';
  address: Scalars['Bytes'];
  allTokens: Array<GqlPoolTokenExpanded>;
  createTime: Scalars['Int'];
  decimals: Scalars['Int'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String'];
  nestingType: GqlPoolNestingType;
  owner: Scalars['Bytes'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String'];
  tokens: Array<GqlPoolTokenUnion>;
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolMetaStable = GqlPoolBase & {
  __typename?: 'GqlPoolMetaStable';
  address: Scalars['Bytes'];
  allTokens: Array<GqlPoolTokenExpanded>;
  amp: Scalars['BigInt'];
  createTime: Scalars['Int'];
  decimals: Scalars['Int'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String'];
  owner: Scalars['Bytes'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String'];
  tokens: Array<GqlPoolToken>;
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolMinimal = {
  __typename?: 'GqlPoolMinimal';
  address: Scalars['Bytes'];
  allTokens: Array<GqlPoolTokenExpanded>;
  createTime: Scalars['Int'];
  decimals: Scalars['Int'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  owner?: Maybe<Scalars['Bytes']>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String'];
  type: GqlPoolMinimalType;
};

export enum GqlPoolMinimalType {
  Element = 'ELEMENT',
  Investment = 'INVESTMENT',
  Linear = 'LINEAR',
  LiquidityBootstrapping = 'LIQUIDITY_BOOTSTRAPPING',
  MetaStable = 'META_STABLE',
  PhantomStable = 'PHANTOM_STABLE',
  Stable = 'STABLE',
  Unknown = 'UNKNOWN',
  Weighted = 'WEIGHTED',
}

export type GqlPoolNestedUnion =
  | GqlPoolLinearNested
  | GqlPoolPhantomStableNested;

export enum GqlPoolNestingType {
  HasOnlyPhantomBpt = 'HAS_ONLY_PHANTOM_BPT',
  HasSomePhantomBpt = 'HAS_SOME_PHANTOM_BPT',
  NoNesting = 'NO_NESTING',
}

export enum GqlPoolOrderBy {
  Apr = 'apr',
  Fees24h = 'fees24h',
  TotalLiquidity = 'totalLiquidity',
  TotalShares = 'totalShares',
  Volume24h = 'volume24h',
}

export enum GqlPoolOrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type GqlPoolPhantomStable = GqlPoolBase & {
  __typename?: 'GqlPoolPhantomStable';
  address: Scalars['Bytes'];
  allTokens: Array<GqlPoolTokenExpanded>;
  amp: Scalars['BigInt'];
  bptPriceRate?: Maybe<Scalars['BigDecimal']>;
  createTime: Scalars['Int'];
  decimals: Scalars['Int'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String'];
  nestingType: GqlPoolNestingType;
  owner: Scalars['Bytes'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String'];
  tokens: Array<GqlPoolTokenUnion>;
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolPhantomStableNested = {
  __typename?: 'GqlPoolPhantomStableNested';
  address: Scalars['Bytes'];
  amp: Scalars['BigInt'];
  bptPriceRate?: Maybe<Scalars['BigDecimal']>;
  createTime: Scalars['Int'];
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  nestingType: GqlPoolNestingType;
  owner: Scalars['Bytes'];
  swapFee: Scalars['BigDecimal'];
  symbol: Scalars['String'];
  tokens: Array<GqlPoolTokenPhantomStableNestedUnion>;
  totalLiquidity: Scalars['BigDecimal'];
  totalShares: Scalars['BigDecimal'];
};

export type GqlPoolSnapshot = {
  __typename?: 'GqlPoolSnapshot';
  amounts: Array<Scalars['String']>;
  fees24h: Scalars['String'];
  holdersCount: Scalars['String'];
  id: Scalars['ID'];
  poolId: Scalars['String'];
  sharePrice: Scalars['String'];
  swapsCount: Scalars['String'];
  timestamp: Scalars['Int'];
  totalLiquidity: Scalars['String'];
  totalShares: Scalars['String'];
  totalSwapFee: Scalars['String'];
  totalSwapVolume: Scalars['String'];
  volume24h: Scalars['String'];
};

export enum GqlPoolSnapshotDataRange {
  AllTime = 'ALL_TIME',
  NinetyDays = 'NINETY_DAYS',
  OneHundredEightyDays = 'ONE_HUNDRED_EIGHTY_DAYS',
  OneYear = 'ONE_YEAR',
  ThirtyDays = 'THIRTY_DAYS',
}

export type GqlPoolStable = GqlPoolBase & {
  __typename?: 'GqlPoolStable';
  address: Scalars['Bytes'];
  allTokens: Array<GqlPoolTokenExpanded>;
  amp: Scalars['BigInt'];
  createTime: Scalars['Int'];
  decimals: Scalars['Int'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String'];
  owner: Scalars['Bytes'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String'];
  tokens: Array<GqlPoolToken>;
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolStablePhantomPoolData = {
  __typename?: 'GqlPoolStablePhantomPoolData';
  address: Scalars['String'];
  balance: Scalars['String'];
  id: Scalars['ID'];
  symbol: Scalars['String'];
  tokens: Array<GqlPoolToken>;
  totalSupply: Scalars['String'];
};

export type GqlPoolStaking = {
  __typename?: 'GqlPoolStaking';
  address: Scalars['String'];
  farm?: Maybe<GqlPoolStakingMasterChefFarm>;
  gauge?: Maybe<GqlPoolStakingGauge>;
  id: Scalars['ID'];
  reliquary?: Maybe<GqlPoolStakingReliquaryFarm>;
  type: GqlPoolStakingType;
};

export type GqlPoolStakingFarmRewarder = {
  __typename?: 'GqlPoolStakingFarmRewarder';
  address: Scalars['String'];
  id: Scalars['ID'];
  rewardPerSecond: Scalars['String'];
  tokenAddress: Scalars['String'];
};

export type GqlPoolStakingGauge = {
  __typename?: 'GqlPoolStakingGauge';
  depositFee: Scalars['Int'];
  gaugeAddress: Scalars['String'];
  id: Scalars['ID'];
  rewards: Array<GqlPoolStakingGaugeReward>;
  withdrawFee: Scalars['Int'];
};

export type GqlPoolStakingGaugeReward = {
  __typename?: 'GqlPoolStakingGaugeReward';
  id: Scalars['ID'];
  rewardPerSecond: Scalars['String'];
  tokenAddress: Scalars['String'];
};

export type GqlPoolStakingMasterChefFarm = {
  __typename?: 'GqlPoolStakingMasterChefFarm';
  beetsPerBlock: Scalars['String'];
  id: Scalars['ID'];
  rewarders?: Maybe<Array<GqlPoolStakingFarmRewarder>>;
};

export type GqlPoolStakingReliquarFarmLevel = {
  __typename?: 'GqlPoolStakingReliquarFarmLevel';
  allocationPoints: Scalars['Int'];
  apr: Scalars['BigDecimal'];
  balance: Scalars['BigDecimal'];
  id: Scalars['ID'];
  level: Scalars['Int'];
  requiredMaturity: Scalars['Int'];
};

export type GqlPoolStakingReliquaryFarm = {
  __typename?: 'GqlPoolStakingReliquaryFarm';
  beetsPerSecond: Scalars['String'];
  id: Scalars['ID'];
  levels?: Maybe<Array<GqlPoolStakingReliquarFarmLevel>>;
};

export enum GqlPoolStakingType {
  FreshBeets = 'FRESH_BEETS',
  Gauge = 'GAUGE',
  MasterChef = 'MASTER_CHEF',
  Reliquary = 'RELIQUARY',
}

export type GqlPoolSwap = {
  __typename?: 'GqlPoolSwap';
  id: Scalars['ID'];
  poolId: Scalars['String'];
  timestamp: Scalars['Int'];
  tokenAmountIn: Scalars['String'];
  tokenAmountOut: Scalars['String'];
  tokenIn: Scalars['String'];
  tokenOut: Scalars['String'];
  tx: Scalars['String'];
  userAddress: Scalars['String'];
  valueUSD: Scalars['Float'];
};

export type GqlPoolSwapFilter = {
  poolIdIn?: InputMaybe<Array<Scalars['String']>>;
  tokenInIn?: InputMaybe<Array<Scalars['String']>>;
  tokenOutIn?: InputMaybe<Array<Scalars['String']>>;
};

export type GqlPoolToken = GqlPoolTokenBase & {
  __typename?: 'GqlPoolToken';
  address: Scalars['String'];
  balance: Scalars['BigDecimal'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  index: Scalars['Int'];
  logoURI?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  priceRate: Scalars['BigDecimal'];
  symbol: Scalars['String'];
  totalBalance: Scalars['BigDecimal'];
  weight?: Maybe<Scalars['BigDecimal']>;
};

export type GqlPoolTokenBase = {
  address: Scalars['String'];
  balance: Scalars['BigDecimal'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  index: Scalars['Int'];
  name: Scalars['String'];
  priceRate: Scalars['BigDecimal'];
  symbol: Scalars['String'];
  totalBalance: Scalars['BigDecimal'];
  weight?: Maybe<Scalars['BigDecimal']>;
};

export type GqlPoolTokenDisplay = {
  __typename?: 'GqlPoolTokenDisplay';
  address: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nestedTokens?: Maybe<Array<GqlPoolTokenDisplay>>;
  symbol: Scalars['String'];
  weight?: Maybe<Scalars['BigDecimal']>;
};

export type GqlPoolTokenExpanded = {
  __typename?: 'GqlPoolTokenExpanded';
  address: Scalars['String'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  isMainToken: Scalars['Boolean'];
  isNested: Scalars['Boolean'];
  isPhantomBpt: Scalars['Boolean'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  weight?: Maybe<Scalars['String']>;
};

export type GqlPoolTokenLinear = GqlPoolTokenBase & {
  __typename?: 'GqlPoolTokenLinear';
  address: Scalars['String'];
  balance: Scalars['BigDecimal'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  index: Scalars['Int'];
  mainTokenBalance: Scalars['BigDecimal'];
  name: Scalars['String'];
  pool: GqlPoolLinearNested;
  priceRate: Scalars['BigDecimal'];
  symbol: Scalars['String'];
  totalBalance: Scalars['BigDecimal'];
  totalMainTokenBalance: Scalars['BigDecimal'];
  weight?: Maybe<Scalars['BigDecimal']>;
  wrappedTokenBalance: Scalars['BigDecimal'];
};

export type GqlPoolTokenPhantomStable = GqlPoolTokenBase & {
  __typename?: 'GqlPoolTokenPhantomStable';
  address: Scalars['String'];
  balance: Scalars['BigDecimal'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  index: Scalars['Int'];
  name: Scalars['String'];
  pool: GqlPoolPhantomStableNested;
  priceRate: Scalars['BigDecimal'];
  symbol: Scalars['String'];
  totalBalance: Scalars['BigDecimal'];
  weight?: Maybe<Scalars['BigDecimal']>;
};

export type GqlPoolTokenPhantomStableNestedUnion =
  | GqlPoolToken
  | GqlPoolTokenLinear;

export type GqlPoolTokenUnion =
  | GqlPoolToken
  | GqlPoolTokenLinear
  | GqlPoolTokenPhantomStable;

export type GqlPoolUnion =
  | GqlPoolElement
  | GqlPoolLinear
  | GqlPoolLiquidityBootstrapping
  | GqlPoolMetaStable
  | GqlPoolPhantomStable
  | GqlPoolStable
  | GqlPoolWeighted;

export type GqlPoolUserSwapVolume = {
  __typename?: 'GqlPoolUserSwapVolume';
  swapVolumeUSD: Scalars['BigDecimal'];
  userAddress: Scalars['String'];
};

export type GqlPoolWeighted = GqlPoolBase & {
  __typename?: 'GqlPoolWeighted';
  address: Scalars['Bytes'];
  allTokens: Array<GqlPoolTokenExpanded>;
  createTime: Scalars['Int'];
  decimals: Scalars['Int'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String'];
  nestingType: GqlPoolNestingType;
  owner: Scalars['Bytes'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String'];
  tokens: Array<GqlPoolTokenUnion>;
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolWithdrawConfig = {
  __typename?: 'GqlPoolWithdrawConfig';
  options: Array<GqlPoolWithdrawOption>;
  proportionalEnabled: Scalars['Boolean'];
  singleAssetEnabled: Scalars['Boolean'];
};

export type GqlPoolWithdrawOption = {
  __typename?: 'GqlPoolWithdrawOption';
  poolTokenAddress: Scalars['String'];
  poolTokenIndex: Scalars['Int'];
  tokenOptions: Array<GqlPoolToken>;
};

export type GqlProtocolFeesCollectorAmounts = {
  __typename?: 'GqlProtocolFeesCollectorAmounts';
  amount: Scalars['Float'];
  poolAddress: Scalars['String'];
  poolId: Scalars['String'];
  poolName: Scalars['String'];
  token: Scalars['String'];
  valueUSD: Scalars['String'];
};

export type GqlProtocolGaugeInfo = {
  __typename?: 'GqlProtocolGaugeInfo';
  address: Scalars['String'];
  poolId: Scalars['String'];
};

export type GqlProtocolMetrics = {
  __typename?: 'GqlProtocolMetrics';
  poolCount: Scalars['BigInt'];
  swapFee24h: Scalars['BigDecimal'];
  swapVolume24h: Scalars['BigDecimal'];
  totalLiquidity: Scalars['BigDecimal'];
  totalSwapFee: Scalars['BigDecimal'];
  totalSwapVolume: Scalars['BigDecimal'];
};

export type GqlProtocolPendingGaugeFee = {
  __typename?: 'GqlProtocolPendingGaugeFee';
  amount: Scalars['Float'];
  gauge: Scalars['String'];
  gaugeAddress: Scalars['String'];
  poolAddress: Scalars['String'];
  poolId: Scalars['String'];
  poolName: Scalars['String'];
  valueUSD: Scalars['Float'];
};

export type GqlProtocolRewardTokenInfo = {
  __typename?: 'GqlProtocolRewardTokenInfo';
  logoURI?: Maybe<Scalars['String']>;
  valueUSD: Scalars['String'];
};

export type GqlSorGetBatchSwapForTokensInResponse = {
  __typename?: 'GqlSorGetBatchSwapForTokensInResponse';
  assets: Array<Scalars['String']>;
  swaps: Array<GqlSorSwap>;
  tokenOutAmount: Scalars['AmountHumanReadable'];
};

export type GqlSorGetSwapsResponse = {
  __typename?: 'GqlSorGetSwapsResponse';
  effectivePrice: Scalars['AmountHumanReadable'];
  effectivePriceReversed: Scalars['AmountHumanReadable'];
  isV1BetterTrade: Scalars['Boolean'];
  marketSp: Scalars['String'];
  priceImpact: Scalars['AmountHumanReadable'];
  returnAmount: Scalars['AmountHumanReadable'];
  returnAmountConsideringFees: Scalars['BigDecimal'];
  returnAmountFromSwaps?: Maybe<Scalars['BigDecimal']>;
  returnAmountScaled: Scalars['BigDecimal'];
  routes: Array<GqlSorSwapRoute>;
  swapAmount: Scalars['AmountHumanReadable'];
  swapAmountForSwaps?: Maybe<Scalars['BigDecimal']>;
  swapAmountScaled: Scalars['BigDecimal'];
  swapType: GqlSorSwapType;
  swaps: Array<GqlSorSwap>;
  tokenAddresses: Array<Scalars['String']>;
  tokenIn: Scalars['String'];
  tokenInAmount: Scalars['AmountHumanReadable'];
  tokenOut: Scalars['String'];
  tokenOutAmount: Scalars['AmountHumanReadable'];
};

export type GqlSorSwap = {
  __typename?: 'GqlSorSwap';
  amount: Scalars['String'];
  assetInIndex: Scalars['Int'];
  assetOutIndex: Scalars['Int'];
  poolId: Scalars['String'];
  userData: Scalars['String'];
};

export type GqlSorSwapOptionsInput = {
  forceRefresh?: InputMaybe<Scalars['Boolean']>;
  maxPools?: InputMaybe<Scalars['Int']>;
  timestamp?: InputMaybe<Scalars['Int']>;
};

export type GqlSorSwapRoute = {
  __typename?: 'GqlSorSwapRoute';
  hops: Array<GqlSorSwapRouteHop>;
  share: Scalars['Float'];
  tokenIn: Scalars['String'];
  tokenInAmount: Scalars['BigDecimal'];
  tokenOut: Scalars['String'];
  tokenOutAmount: Scalars['BigDecimal'];
};

export type GqlSorSwapRouteHop = {
  __typename?: 'GqlSorSwapRouteHop';
  pool: GqlPoolMinimal;
  poolId: Scalars['String'];
  tokenIn: Scalars['String'];
  tokenInAmount: Scalars['BigDecimal'];
  tokenOut: Scalars['String'];
  tokenOutAmount: Scalars['BigDecimal'];
};

export enum GqlSorSwapType {
  ExactIn = 'EXACT_IN',
  ExactOut = 'EXACT_OUT',
}

export type GqlToken = {
  __typename?: 'GqlToken';
  address: Scalars['String'];
  chainId: Scalars['Int'];
  coingeckoTokenId?: Maybe<Scalars['String']>;
  decimals: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  discordUrl?: Maybe<Scalars['String']>;
  logoURI?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  priority: Scalars['Int'];
  symbol: Scalars['String'];
  telegramUrl?: Maybe<Scalars['String']>;
  tradable: Scalars['Boolean'];
  twitterUsername?: Maybe<Scalars['String']>;
  websiteUrl?: Maybe<Scalars['String']>;
};

export type GqlTokenAmountHumanReadable = {
  address: Scalars['String'];
  amount: Scalars['AmountHumanReadable'];
};

export type GqlTokenCandlestickChartDataItem = {
  __typename?: 'GqlTokenCandlestickChartDataItem';
  close: Scalars['AmountHumanReadable'];
  high: Scalars['AmountHumanReadable'];
  id: Scalars['ID'];
  low: Scalars['AmountHumanReadable'];
  open: Scalars['AmountHumanReadable'];
  timestamp: Scalars['Int'];
};

export enum GqlTokenChartDataRange {
  SevenDay = 'SEVEN_DAY',
  ThirtyDay = 'THIRTY_DAY',
}

export type GqlTokenData = {
  __typename?: 'GqlTokenData';
  description?: Maybe<Scalars['String']>;
  discordUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  telegramUrl?: Maybe<Scalars['String']>;
  tokenAddress: Scalars['String'];
  twitterUsername?: Maybe<Scalars['String']>;
  websiteUrl?: Maybe<Scalars['String']>;
};

export type GqlTokenDynamicData = {
  __typename?: 'GqlTokenDynamicData';
  ath: Scalars['Float'];
  atl: Scalars['Float'];
  fdv?: Maybe<Scalars['String']>;
  high24h: Scalars['Float'];
  id: Scalars['String'];
  low24h: Scalars['Float'];
  marketCap?: Maybe<Scalars['String']>;
  price: Scalars['Float'];
  priceChange24h: Scalars['Float'];
  priceChangePercent7d?: Maybe<Scalars['Float']>;
  priceChangePercent14d?: Maybe<Scalars['Float']>;
  priceChangePercent24h: Scalars['Float'];
  priceChangePercent30d?: Maybe<Scalars['Float']>;
  tokenAddress: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type GqlTokenPrice = {
  __typename?: 'GqlTokenPrice';
  address: Scalars['String'];
  price: Scalars['Float'];
};

export type GqlTokenPriceChartDataItem = {
  __typename?: 'GqlTokenPriceChartDataItem';
  id: Scalars['ID'];
  price: Scalars['AmountHumanReadable'];
  timestamp: Scalars['Int'];
};

export enum GqlTokenType {
  Bpt = 'BPT',
  LinearWrappedToken = 'LINEAR_WRAPPED_TOKEN',
  PhantomBpt = 'PHANTOM_BPT',
  WhiteListed = 'WHITE_LISTED',
}

export type GqlUserFbeetsBalance = {
  __typename?: 'GqlUserFbeetsBalance';
  id: Scalars['String'];
  stakedBalance: Scalars['AmountHumanReadable'];
  totalBalance: Scalars['AmountHumanReadable'];
  walletBalance: Scalars['AmountHumanReadable'];
};

export type GqlUserGaugeBoost = {
  __typename?: 'GqlUserGaugeBoost';
  boost: Scalars['String'];
  gaugeAddress: Scalars['String'];
  poolId: Scalars['String'];
};

export type GqlUserPoolBalance = {
  __typename?: 'GqlUserPoolBalance';
  poolId: Scalars['String'];
  stakedBalance: Scalars['AmountHumanReadable'];
  tokenAddress: Scalars['String'];
  tokenPrice: Scalars['Float'];
  totalBalance: Scalars['AmountHumanReadable'];
  walletBalance: Scalars['AmountHumanReadable'];
};

export type GqlUserPoolSnapshot = {
  __typename?: 'GqlUserPoolSnapshot';
  farmBalance: Scalars['AmountHumanReadable'];
  fees24h: Scalars['AmountHumanReadable'];
  gaugeBalance: Scalars['AmountHumanReadable'];
  percentShare: Scalars['Float'];
  timestamp: Scalars['Int'];
  totalBalance: Scalars['AmountHumanReadable'];
  totalValueUSD: Scalars['AmountHumanReadable'];
  walletBalance: Scalars['AmountHumanReadable'];
};

export type GqlUserPortfolioSnapshot = {
  __typename?: 'GqlUserPortfolioSnapshot';
  farmBalance: Scalars['AmountHumanReadable'];
  fees24h: Scalars['AmountHumanReadable'];
  gaugeBalance: Scalars['AmountHumanReadable'];
  pools: Array<GqlUserPoolSnapshot>;
  timestamp: Scalars['Int'];
  totalBalance: Scalars['AmountHumanReadable'];
  totalFees: Scalars['AmountHumanReadable'];
  totalValueUSD: Scalars['AmountHumanReadable'];
  walletBalance: Scalars['AmountHumanReadable'];
};

export type GqlUserProtocolReward = {
  __typename?: 'GqlUserProtocolReward';
  amount: Scalars['String'];
  isBPT: Scalars['Boolean'];
  poolId: Scalars['String'];
  token: Scalars['String'];
  tokenInfo: GqlProtocolRewardTokenInfo;
  tokenList: Array<GqlToken>;
};

export enum GqlUserSnapshotDataRange {
  AllTime = 'ALL_TIME',
  NinetyDays = 'NINETY_DAYS',
  OneHundredEightyDays = 'ONE_HUNDRED_EIGHTY_DAYS',
  OneYear = 'ONE_YEAR',
  ThirtyDays = 'THIRTY_DAYS',
}

export type GqlUserSwapVolumeFilter = {
  poolIdIn?: InputMaybe<Array<Scalars['String']>>;
  tokenInIn?: InputMaybe<Array<Scalars['String']>>;
  tokenOutIn?: InputMaybe<Array<Scalars['String']>>;
};

export type GqlUserVoteEscrowInfo = {
  __typename?: 'GqlUserVoteEscrowInfo';
  currentBalance: Scalars['String'];
  epoch: Scalars['String'];
  hasExistingLock: Scalars['Boolean'];
  isExpired: Scalars['Boolean'];
  lockEndDate: Scalars['String'];
  lockedAmount: Scalars['String'];
  percentOwned: Scalars['String'];
  totalSupply: Scalars['String'];
};

export type LiquidityGauge = {
  __typename?: 'LiquidityGauge';
  /**  Address of the pool (lp_token of the gauge)  */
  address: Scalars['String'];
  bribes: Array<Maybe<GaugeBribe>>;
  currentEpochBribes: Array<Maybe<GaugeBribe>>;
  depositFee: Scalars['Int'];
  factory?: Maybe<GaugeFactory>;
  /**  LiquidityGauge contract address  */
  id: Scalars['ID'];
  /**  Whether Balancer DAO killed the gauge  */
  isKilled: Scalars['Boolean'];
  nextEpochBribes: Array<Maybe<GaugeBribe>>;
  /**  Reference to Pool entity  */
  pool: GaugePool;
  /**  Pool ID if lp_token is a Balancer pool; null otherwise  */
  poolId: Scalars['String'];
  /**  List of reward tokens depositted in the gauge  */
  rewardTokens: Array<RewardToken>;
  /**  List of user shares  */
  shares: Array<GaugeShare>;
  /**  ERC20 token symbol  */
  symbol: Scalars['String'];
  /**  Total of BPTs users have staked in the LiquidityGauge  */
  totalSupply: Scalars['BigDecimal'];
  withdrawFee: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cacheAverageBlockTime: Scalars['String'];
  doStakes: Scalars['Boolean'];
  poolInitializeSnapshotsForPool: Scalars['String'];
  poolLoadOnChainDataForAllPools: Scalars['String'];
  poolLoadOnChainDataForPoolsWithActiveUpdates: Scalars['String'];
  poolLoadSnapshotsForAllPools: Scalars['String'];
  poolReloadAllPoolAprs: Scalars['String'];
  poolReloadAllTokenNestedPoolIds: Scalars['String'];
  poolReloadPoolNestedTokens: Scalars['String'];
  poolReloadStakingForAllPools: Scalars['String'];
  poolSyncAllPoolsFromSubgraph: Array<Scalars['String']>;
  poolSyncLatestSnapshotsForAllPools: Scalars['String'];
  poolSyncNewPoolsFromSubgraph: Array<Scalars['String']>;
  poolSyncPool: Scalars['String'];
  poolSyncPoolAllTokensRelationship: Scalars['String'];
  poolSyncSanityPoolData: Scalars['String'];
  poolSyncSwapsForLast48Hours: Scalars['String'];
  poolSyncTotalShares: Scalars['String'];
  poolUpdateAprs: Scalars['String'];
  poolUpdateLifetimeValuesForAllPools: Scalars['String'];
  poolUpdateLiquidity24hAgoForAllPools: Scalars['String'];
  poolUpdateLiquidityValuesForAllPools: Scalars['String'];
  poolUpdateVolumeAndFeeValuesForAllPools: Scalars['String'];
  protocolCacheMetrics: Scalars['String'];
  syncGaugeData: Scalars['Boolean'];
  tokenDeletePrice: Scalars['Boolean'];
  tokenDeleteTokenType: Scalars['String'];
  tokenInitChartData: Scalars['String'];
  tokenReloadTokenPrices?: Maybe<Scalars['Boolean']>;
  tokenSyncTokenDefinitions: Scalars['String'];
  tokenSyncTokenDynamicData: Scalars['String'];
  userInitStakedBalances: Scalars['String'];
  userInitWalletBalancesForAllPools: Scalars['String'];
  userInitWalletBalancesForPool: Scalars['String'];
  userSyncBalance: Scalars['String'];
  userSyncBalanceAllPools: Scalars['String'];
  userSyncChangedStakedBalances: Scalars['String'];
  userSyncChangedWalletBalancesForAllPools: Scalars['String'];
};

export type MutationPoolInitializeSnapshotsForPoolArgs = {
  poolId: Scalars['String'];
};

export type MutationPoolReloadPoolNestedTokensArgs = {
  poolId: Scalars['String'];
};

export type MutationPoolSyncLatestSnapshotsForAllPoolsArgs = {
  daysToSync?: InputMaybe<Scalars['Int']>;
};

export type MutationPoolSyncPoolArgs = {
  poolId: Scalars['String'];
};

export type MutationTokenDeletePriceArgs = {
  timestamp: Scalars['Int'];
  tokenAddress: Scalars['String'];
};

export type MutationTokenDeleteTokenTypeArgs = {
  tokenAddress: Scalars['String'];
  type: GqlTokenType;
};

export type MutationTokenInitChartDataArgs = {
  tokenAddress: Scalars['String'];
};

export type MutationUserInitWalletBalancesForPoolArgs = {
  poolId: Scalars['String'];
};

export type MutationUserSyncBalanceArgs = {
  poolId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  adminGetAllGaugePendingProtocolFees: GqlPendingGaugeFeeResult;
  adminGetAllPendingFeeData: GqlAllFeesData;
  adminGetFeeCollectorBalances: GqlFeesCollectorAmountsResult;
  beetsGetBeetsPrice: Scalars['String'];
  blocksGetAverageBlockTime: Scalars['Float'];
  blocksGetBlocksPerDay: Scalars['Float'];
  blocksGetBlocksPerSecond: Scalars['Float'];
  blocksGetBlocksPerYear: Scalars['Float'];
  contentGetNewsItems: Array<Maybe<GqlContentNewsItem>>;
  get24HourGaugeFees?: Maybe<Array<Maybe<Scalars['String']>>>;
  getGaugeBribes: Array<Maybe<GaugeBribe>>;
  getLiquidityGauges: Array<Maybe<LiquidityGauge>>;
  getProtocolPoolData: Array<Maybe<GqlProtocolGaugeInfo>>;
  getProtocolTokenList?: Maybe<Array<Maybe<Scalars['String']>>>;
  getRewardPools: Array<Maybe<RewardPool>>;
  getUserGaugeStakes: Array<Maybe<LiquidityGauge>>;
  latestSyncedBlocks: GqlLatestSyncedBlocks;
  poolGetAllPoolsSnapshots: Array<GqlPoolSnapshot>;
  poolGetBatchSwaps: Array<GqlPoolBatchSwap>;
  poolGetFeaturedPoolGroups: Array<GqlPoolFeaturedPoolGroup>;
  poolGetJoinExits: Array<GqlPoolJoinExit>;
  poolGetLinearPools: Array<GqlPoolLinear>;
  poolGetPool: GqlPoolBase;
  poolGetPoolFilters: Array<GqlPoolFilterDefinition>;
  poolGetPools: Array<GqlPoolMinimal>;
  poolGetPoolsCount: Scalars['Int'];
  poolGetSnapshots: Array<GqlPoolSnapshot>;
  poolGetSwaps: Array<GqlPoolSwap>;
  poolGetUserSwapVolume: Array<GqlPoolUserSwapVolume>;
  protocolMetrics: GqlProtocolMetrics;
  sorGetBatchSwapForTokensIn: GqlSorGetBatchSwapForTokensInResponse;
  sorGetSwaps: GqlSorGetSwapsResponse;
  tokenGetCandlestickChartData: Array<GqlTokenCandlestickChartDataItem>;
  tokenGetCurrentPrices: Array<GqlTokenPrice>;
  tokenGetHistoricalPrices: Array<GqlHistoricalTokenPrice>;
  tokenGetPriceChartData: Array<GqlTokenPriceChartDataItem>;
  tokenGetRelativePriceChartData: Array<GqlTokenPriceChartDataItem>;
  tokenGetTokenData?: Maybe<GqlTokenData>;
  tokenGetTokenDynamicData?: Maybe<GqlTokenDynamicData>;
  tokenGetTokens: Array<GqlToken>;
  tokenGetTokensData: Array<GqlTokenData>;
  tokenGetTokensDynamicData: Array<GqlTokenDynamicData>;
  userGetFbeetsBalance: GqlUserFbeetsBalance;
  userGetGaugeBoosts: Array<Maybe<GqlUserGaugeBoost>>;
  userGetPoolBalances: Array<GqlUserPoolBalance>;
  userGetPoolJoinExits: Array<GqlPoolJoinExit>;
  userGetPortfolioSnapshots: Array<GqlUserPortfolioSnapshot>;
  userGetProtocolRewardInfo: Array<Maybe<GqlUserProtocolReward>>;
  userGetStaking: Array<GqlPoolStaking>;
  userGetSwaps: Array<GqlPoolSwap>;
  userGetVeLockInfo: GqlUserVoteEscrowInfo;
};

export type QueryAdminGetAllPendingFeeDataArgs = {
  onlyWithBalances?: InputMaybe<Scalars['Boolean']>;
};

export type QueryGet24HourGaugeFeesArgs = {
  hoursInPast?: InputMaybe<Scalars['Int']>;
};

export type QueryGetGaugeBribesArgs = {
  epoch?: InputMaybe<Scalars['Int']>;
};

export type QueryGetRewardPoolsArgs = {
  user?: InputMaybe<Scalars['String']>;
};

export type QueryGetUserGaugeStakesArgs = {
  poolIds: Array<Scalars['String']>;
  user: Scalars['String'];
};

export type QueryPoolGetAllPoolsSnapshotsArgs = {
  range: GqlPoolSnapshotDataRange;
};

export type QueryPoolGetBatchSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GqlPoolSwapFilter>;
};

export type QueryPoolGetJoinExitsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GqlPoolJoinExitFilter>;
};

export type QueryPoolGetPoolArgs = {
  id: Scalars['String'];
};

export type QueryPoolGetPoolsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GqlPoolOrderBy>;
  orderDirection?: InputMaybe<GqlPoolOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  textSearch?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<GqlPoolFilter>;
};

export type QueryPoolGetPoolsCountArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GqlPoolOrderBy>;
  orderDirection?: InputMaybe<GqlPoolOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  textSearch?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<GqlPoolFilter>;
};

export type QueryPoolGetSnapshotsArgs = {
  id: Scalars['String'];
  range: GqlPoolSnapshotDataRange;
};

export type QueryPoolGetSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GqlPoolSwapFilter>;
};

export type QueryPoolGetUserSwapVolumeArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GqlUserSwapVolumeFilter>;
};

export type QuerySorGetBatchSwapForTokensInArgs = {
  swapOptions: GqlSorSwapOptionsInput;
  tokenOut: Scalars['String'];
  tokensIn: Array<GqlTokenAmountHumanReadable>;
};

export type QuerySorGetSwapsArgs = {
  swapAmount: Scalars['BigDecimal'];
  swapOptions: GqlSorSwapOptionsInput;
  swapType: GqlSorSwapType;
  tokenIn: Scalars['String'];
  tokenOut: Scalars['String'];
};

export type QueryTokenGetCandlestickChartDataArgs = {
  address: Scalars['String'];
  range: GqlTokenChartDataRange;
};

export type QueryTokenGetHistoricalPricesArgs = {
  addresses: Array<Scalars['String']>;
};

export type QueryTokenGetPriceChartDataArgs = {
  address: Scalars['String'];
  range: GqlTokenChartDataRange;
};

export type QueryTokenGetRelativePriceChartDataArgs = {
  range: GqlTokenChartDataRange;
  tokenIn: Scalars['String'];
  tokenOut: Scalars['String'];
};

export type QueryTokenGetTokenDataArgs = {
  address: Scalars['String'];
};

export type QueryTokenGetTokenDynamicDataArgs = {
  address: Scalars['String'];
};

export type QueryTokenGetTokensDataArgs = {
  addresses: Array<Scalars['String']>;
};

export type QueryTokenGetTokensDynamicDataArgs = {
  addresses: Array<Scalars['String']>;
};

export type QueryUserGetGaugeBoostsArgs = {
  userAddress?: InputMaybe<Scalars['String']>;
};

export type QueryUserGetPoolJoinExitsArgs = {
  first: Scalars['Int'];
  poolId: Scalars['String'];
  skip: Scalars['Int'];
};

export type QueryUserGetPortfolioSnapshotsArgs = {
  days: Scalars['Int'];
};

export type QueryUserGetSwapsArgs = {
  first: Scalars['Int'];
  poolId: Scalars['String'];
  skip: Scalars['Int'];
};

export type RewardPool = {
  __typename?: 'RewardPool';
  address: Scalars['String'];
  amountStaked: Scalars['String'];
  amountStakedValue: Scalars['String'];
  aprs: RewardPoolAprs;
  blocksRemaining: Scalars['String'];
  daysRemaining: Scalars['String'];
  endBlock: Scalars['Int'];
  isPartnerPool: Scalars['Boolean'];
  rewardToken: RewardPoolRewardToken;
  startBlock: Scalars['Int'];
  userInfo?: Maybe<RewardPoolUserInfo>;
};

export type RewardPoolAprs = {
  __typename?: 'RewardPoolAprs';
  apr: Scalars['String'];
  daily: Scalars['String'];
};

export type RewardPoolRewardToken = {
  __typename?: 'RewardPoolRewardToken';
  address: Scalars['String'];
  logoURI: Scalars['String'];
  name: Scalars['String'];
  price?: Maybe<Scalars['Int']>;
  rewardPerBlock: Scalars['String'];
  symbol: Scalars['String'];
};

export type RewardPoolUserInfo = {
  __typename?: 'RewardPoolUserInfo';
  amountDeposited: Scalars['String'];
  amountDepositedFull: Scalars['String'];
  depositValue: Scalars['String'];
  hasPendingRewards: Scalars['Boolean'];
  pendingRewardValue: Scalars['String'];
  pendingRewards: Scalars['String'];
  percentageOwned: Scalars['String'];
  poolAddress: Scalars['String'];
};

export type RewardToken = {
  __typename?: 'RewardToken';
  /**  ERC20 token decimals - zero if call to decimals() reverts  */
  decimals: Scalars['Int'];
  /**  Equal to: <tokenAddress>-<gaugeAddress>  */
  id: Scalars['ID'];
  logoURI: Scalars['String'];
  /**  Timestamp at which finishes the period of rewards  */
  periodFinish?: Maybe<Scalars['BigInt']>;
  /**  Rate of reward tokens streamed per second  */
  rewardPerSecond: Scalars['BigDecimal'];
  /**  ERC20 token symbol - empty string if call to symbol() reverts  */
  symbol: Scalars['String'];
  tokenAddress: Scalars['String'];
  /**  Amount of reward tokens that has been deposited into the gauge  */
  totalDeposited: Scalars['BigDecimal'];
};

export type User = {
  __typename?: 'User';
  /**  List of gauge the user has shares  */
  gaugeShares?: Maybe<Array<GaugeShare>>;
  /**  List of votes on gauges  */
  gaugeVotes?: Maybe<Array<GaugeVote>>;
  /**  User address  */
  id: Scalars['ID'];
  /**  List of locks the user created  */
  votingLocks?: Maybe<Array<VotingEscrowLock>>;
};

export type VotingEscrow = {
  __typename?: 'VotingEscrow';
  /**  VotingEscrow contract address  */
  id: Scalars['ID'];
  /**  List of veBAL locks created  */
  locks?: Maybe<Array<VotingEscrowLock>>;
  /**  Amount of B-80BAL-20WETH BPT locked  */
  stakedSupply: Scalars['BigDecimal'];
};

export type VotingEscrowLock = {
  __typename?: 'VotingEscrowLock';
  /**  Equal to: <userAdress>-<votingEscrow>  */
  id: Scalars['ID'];
  /**  Amount of B-80BAL-20WETH BPT the user has locked  */
  lockedBalance: Scalars['BigDecimal'];
  /**  Timestamp at which B-80BAL-20WETH BPT can be unlocked by user [seconds]  */
  unlockTime?: Maybe<Scalars['BigInt']>;
  updatedAt: Scalars['Int'];
  /**  Reference to User entity  */
  user: User;
  /**  Reference to VotingEscrow entity  */
  votingEscrowID: VotingEscrow;
};

export type GetPoolQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetPoolQuery = {
  __typename?: 'Query';
  poolGetPool:
    | {
        __typename?: 'GqlPoolElement';
        id: string;
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        displayTokens: Array<{
          __typename?: 'GqlPoolTokenDisplay';
          address: string;
          symbol: string;
          name: string;
        }>;
      }
    | {
        __typename?: 'GqlPoolLinear';
        id: string;
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        displayTokens: Array<{
          __typename?: 'GqlPoolTokenDisplay';
          address: string;
          symbol: string;
          name: string;
        }>;
      }
    | {
        __typename?: 'GqlPoolLiquidityBootstrapping';
        id: string;
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        displayTokens: Array<{
          __typename?: 'GqlPoolTokenDisplay';
          address: string;
          symbol: string;
          name: string;
        }>;
      }
    | {
        __typename?: 'GqlPoolMetaStable';
        id: string;
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        displayTokens: Array<{
          __typename?: 'GqlPoolTokenDisplay';
          address: string;
          symbol: string;
          name: string;
        }>;
      }
    | {
        __typename?: 'GqlPoolPhantomStable';
        id: string;
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        displayTokens: Array<{
          __typename?: 'GqlPoolTokenDisplay';
          address: string;
          symbol: string;
          name: string;
        }>;
      }
    | {
        __typename?: 'GqlPoolStable';
        id: string;
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        displayTokens: Array<{
          __typename?: 'GqlPoolTokenDisplay';
          address: string;
          symbol: string;
          name: string;
        }>;
      }
    | {
        __typename?: 'GqlPoolWeighted';
        id: string;
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        displayTokens: Array<{
          __typename?: 'GqlPoolTokenDisplay';
          address: string;
          symbol: string;
          name: string;
        }>;
      };
};

export type GetAllPoolsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllPoolsQuery = {
  __typename?: 'Query';
  poolGetPools: Array<{
    __typename?: 'GqlPoolMinimal';
    id: string;
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    displayTokens: Array<{
      __typename?: 'GqlPoolTokenDisplay';
      id: string;
      address: string;
      symbol: string;
      name: string;
    }>;
  }>;
};

export type GetAllTokensQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllTokensQuery = {
  __typename?: 'Query';
  tokenGetTokens: Array<{
    __typename?: 'GqlToken';
    address: string;
    name: string;
    symbol: string;
    chainId: number;
    logoURI?: string | null;
    decimals: number;
    tradable: boolean;
    priority: number;
  }>;
};

export type AdminGetAllPendingFeeDataQueryVariables = Exact<{
  [key: string]: never;
}>;

export type AdminGetAllPendingFeeDataQuery = {
  __typename?: 'Query';
  adminGetAllPendingFeeData: {
    __typename?: 'GqlAllFeesData';
    totalValueUSD: number;
    gauges: {
      __typename?: 'GqlPendingGaugeFeeResult';
      totalValueUSD: number;
      values: Array<{
        __typename?: 'GqlProtocolPendingGaugeFee';
        poolId: string;
        poolAddress: string;
        poolName: string;
        gauge: string;
        gaugeAddress: string;
        amount: number;
        valueUSD: number;
      } | null>;
    };
    feeCollector: {
      __typename?: 'GqlFeesCollectorAmountsResult';
      totalValueUSD: number;
      values: Array<{
        __typename?: 'GqlProtocolFeesCollectorAmounts';
        poolId: string;
        poolAddress: string;
        poolName: string;
        token: string;
        amount: number;
        valueUSD: string;
      } | null>;
    };
  };
};

type GqlPoolBaseFragment_GqlPoolElement_Fragment = {
  __typename?: 'GqlPoolElement';
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displayTokens: Array<{
    __typename?: 'GqlPoolTokenDisplay';
    address: string;
    symbol: string;
    name: string;
  }>;
};

type GqlPoolBaseFragment_GqlPoolLinear_Fragment = {
  __typename?: 'GqlPoolLinear';
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displayTokens: Array<{
    __typename?: 'GqlPoolTokenDisplay';
    address: string;
    symbol: string;
    name: string;
  }>;
};

type GqlPoolBaseFragment_GqlPoolLiquidityBootstrapping_Fragment = {
  __typename?: 'GqlPoolLiquidityBootstrapping';
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displayTokens: Array<{
    __typename?: 'GqlPoolTokenDisplay';
    address: string;
    symbol: string;
    name: string;
  }>;
};

type GqlPoolBaseFragment_GqlPoolMetaStable_Fragment = {
  __typename?: 'GqlPoolMetaStable';
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displayTokens: Array<{
    __typename?: 'GqlPoolTokenDisplay';
    address: string;
    symbol: string;
    name: string;
  }>;
};

type GqlPoolBaseFragment_GqlPoolPhantomStable_Fragment = {
  __typename?: 'GqlPoolPhantomStable';
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displayTokens: Array<{
    __typename?: 'GqlPoolTokenDisplay';
    address: string;
    symbol: string;
    name: string;
  }>;
};

type GqlPoolBaseFragment_GqlPoolStable_Fragment = {
  __typename?: 'GqlPoolStable';
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displayTokens: Array<{
    __typename?: 'GqlPoolTokenDisplay';
    address: string;
    symbol: string;
    name: string;
  }>;
};

type GqlPoolBaseFragment_GqlPoolWeighted_Fragment = {
  __typename?: 'GqlPoolWeighted';
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displayTokens: Array<{
    __typename?: 'GqlPoolTokenDisplay';
    address: string;
    symbol: string;
    name: string;
  }>;
};

export type GqlPoolBaseFragmentFragment =
  | GqlPoolBaseFragment_GqlPoolElement_Fragment
  | GqlPoolBaseFragment_GqlPoolLinear_Fragment
  | GqlPoolBaseFragment_GqlPoolLiquidityBootstrapping_Fragment
  | GqlPoolBaseFragment_GqlPoolMetaStable_Fragment
  | GqlPoolBaseFragment_GqlPoolPhantomStable_Fragment
  | GqlPoolBaseFragment_GqlPoolStable_Fragment
  | GqlPoolBaseFragment_GqlPoolWeighted_Fragment;

export type GqlPoolMinimalFragmentFragment = {
  __typename?: 'GqlPoolMinimal';
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displayTokens: Array<{
    __typename?: 'GqlPoolTokenDisplay';
    id: string;
    address: string;
    symbol: string;
    name: string;
  }>;
};

export const GqlPoolBaseFragmentFragmentDoc = gql`
  fragment GqlPoolBaseFragment on GqlPoolBase {
    id
    name
    symbol
    address
    decimals
    displayTokens {
      address
      symbol
      name
    }
  }
`;
export const GqlPoolMinimalFragmentFragmentDoc = gql`
  fragment GqlPoolMinimalFragment on GqlPoolMinimal {
    id
    name
    symbol
    address
    decimals
    displayTokens {
      id
      address
      symbol
      name
    }
  }
`;
export const GetPoolDocument = gql`
  query GetPool($id: String!) {
    poolGetPool(id: $id) {
      ...GqlPoolBaseFragment
    }
  }
  ${GqlPoolBaseFragmentFragmentDoc}
`;
export const GetAllPoolsDocument = gql`
  query GetAllPools {
    poolGetPools {
      ...GqlPoolMinimalFragment
    }
  }
  ${GqlPoolMinimalFragmentFragmentDoc}
`;
export const GetAllTokensDocument = gql`
  query GetAllTokens {
    tokenGetTokens {
      address
      name
      symbol
      chainId
      logoURI
      decimals
      tradable
      priority
    }
  }
`;
export const AdminGetAllPendingFeeDataDocument = gql`
  query AdminGetAllPendingFeeData {
    adminGetAllPendingFeeData {
      totalValueUSD
      gauges {
        totalValueUSD
        values {
          poolId
          poolAddress
          poolName
          gauge
          gaugeAddress
          amount
          valueUSD
        }
      }
      feeCollector {
        totalValueUSD
        values {
          poolId
          poolAddress
          poolName
          token
          amount
          valueUSD
        }
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    GetPool(
      variables: GetPoolQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetPoolQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetPoolQuery>(GetPoolDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetPool',
        'query',
      );
    },
    GetAllPools(
      variables?: GetAllPoolsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetAllPoolsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetAllPoolsQuery>(GetAllPoolsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetAllPools',
        'query',
      );
    },
    GetAllTokens(
      variables?: GetAllTokensQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<GetAllTokensQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetAllTokensQuery>(GetAllTokensDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetAllTokens',
        'query',
      );
    },
    AdminGetAllPendingFeeData(
      variables?: AdminGetAllPendingFeeDataQueryVariables,
      requestHeaders?: Dom.RequestInit['headers'],
    ): Promise<AdminGetAllPendingFeeDataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AdminGetAllPendingFeeDataQuery>(
            AdminGetAllPendingFeeDataDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'AdminGetAllPendingFeeData',
        'query',
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
