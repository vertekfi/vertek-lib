// enum GaugeType { LiquidityMiningCommittee, veBAL, Ethereum, Polygon, Arbitrum, Optimism, Gnosis, ZKSync }
export enum GaugeType {
  LiquidityMiningCommittee = 'LiquidityMiningCommittee',
  veBAL = 'veBAL', // BalTokenHolder recipient type
  Ethereum = 'Ethereum',
  veVRTK = 'veVRTK', // BalTokenHolder recipient type
}

export enum GaugeTypeNum {
  LiquidityMiningCommittee, // emissions received at discretion of "committee"
  veBAL, // BalTokenHolder recipient type
  Ethereum, // can be voted for
  veVRTK, // BalTokenHolder recipient type
}
