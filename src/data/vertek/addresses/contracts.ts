export const CONTRACT_MAP = {
  AssetManager: {
    5: '',
    56: '',
  },
  Vault: {
    5: '0xBA5CE8dFcB1E077B4537aCaD17400D843842c520',
    56: '0x719488F4E859953967eFE963c6Bed059BaAab60c',
  },
  Vault_V1: {
    56: '0xEE1c8DbfBf958484c6a4571F5FB7b99B74A54AA7',
  },
  ProtocolFeesCollector: {
    5: '0xA4F39c3D0B3eACD6CdE486f13ccB77d822A30B41',
    56: '0xAc8E65B3B925bf09a330549ed092E2ECE2B38712',
  },
  MockAuthorizer: {
    5: '0x2407929e13935990740C524db4C9dd58191fB9Dd',
    56: '0xF524b85fB03982c3ABdC7E5C87913E06d204843f',
  },
  TimelockAuthorizer: {
    5: '0xA89bb713f49B5Ce26b1442C2207706E848486a44',
    56: '0xFf51102356a01DeE3cF1d44964d40f57f69e9b3D',
  },
  TimelockExecutor: {
    5: '0xBc4e809A2fD4F53140290aACBD838d4921C1F2D5',
    56: '0xFB48eBC4A03adf0460175938b6f0554891157698',
  },
  AuthorizerAdaptor: {
    5: '0xC3239522Dc093D38F0B73E2a47D55Ed844A03033',
    56: '0xf29B798a7A29585F6bdB79ff2992FB0787b2c1a5',
  },
  AuthorizerAdaptorEntrypoint: {
    5: '0x995867756f901e1589dDE4Fee09dd6cb26E39201',
    56: '0x6Fde338b088205C178bA669c43B86D35499f0920',
  },
  ProtocolFeePercentagesProvider: {
    5: '0x42FA1676647dEDDE4538904FAd9cA9FDde66509b',
    56: '0xAf1D403ce21e7803D37B2E950Cc49235B71dfc34',
  },
  WeightedPoolFactory: {
    5: '0x94b67Ee1359A26E0527BFafD9C37aD84D9ABda77',
    56: '0xDE8993Bf9D6Eb1e0d752fe56ccB85Ef76538ABb6',
  },
  WeightedFactoryHighFee: {
    56: '0xb9C7a581F0792d667beb684Bab1AF4FFFa14DA98',
  },

  BalancerTokenAdmin: {
    5: '0xf4f37A6F5D836AB19f4C7Caf65c780108dB68e12',
    56: '0x8A935a7c86CA749aD1C6fD7dAA0A916A0ACF8bF8', // block 25101885 (Jan-25-2023 08:43:47 PM +UTC)
  },
  BalancerMinter: {
    5: '0xd48397ad761D622AE42e551b8C1cb0E3C5a03E3B',
    56: '0xeF0bb9a74218649dE92C86FE0add74c5a03C4c09',
  },

  VotingEscrow: {
    5: '0x76B64524071b3e56EE8EFBc125a53BBbF04D41aB',
    56: '0x98A73443fb00EDC2EFF0520a00C53633226BF9ED', // block 25103953  (Jan-25-2023 10:27:21 PM +UTC) 5:27PM EST - 1674686088
  },
  VeBoostV2: {
    5: '0xB88683951708f05D89242BD4BEBD27ce0B884D29',
    56: '0xa823A1F9C77aaBFFb3f7Ae67e2D8dC085BEca1C5',
  },
  VotingEscrowDelegationProxy: {
    5: '0xcb180DFA6C96CC80c852C3493B19eEC52D68e46A',
    56: '0x4763Ef7835280D875Cb86cb5c41812e63A91217F',
  },
  VeBalHelper: {
    5: '0xf2Ac25c69b05C1a7560dECc7363c5150B24eD974',
    56: '0xab31C0E1019a8e08748235a76f94497AF9d8718E',
  },
  GaugeController: {
    5: '0x7bC6C2bF0c730E03285f673806586C60AC0B3205',
    56: '0x99bFf5953843A211792BF3715b1b3b4CBeE34CE6', // block 25104102 (Jan-25-2023 10:34:48 PM +UTC) 5:34PM EST
  },
  LiquidityGaugeFactory: {
    5: '0x70Bb570d76b3c83bcE8C36993fFC1aF7Ac407a63',
    56: '0xE7Eb5DcF8371746c8Aafd382E8Dd29F847966120',
  },
  LiquidityGaugeV5: {
    5: '0xf1b9BcA00a8E1574243D729dc0e2aEFc715Bc48f',
    56: '0x722c939f0447dBD32D089782E7452B38c12c1Cd4',
  },
  GaugeAdder: {
    5: '',
    56: '',
  },
  SmartWalletChecker: {
    5: '',
    56: '',
  },
  FeeDistributor: {
    5: '0xd4ccC5b4d7085603BB03C366F25738494B12E8c9',
    56: '0x1ac7c3C34d03f0b4E97FB4a3F08dF4DE6989FfB3',
  },
  LiquidityBootstrappingPoolFactory: {
    5: '',
    56: '',
  },
  ComposableStablePoolFactoryV3: {
    56: '0xfD50F5eAd870bdCFa69940c41a5C10f015b419e7',
  },
  ComposableStablePool: {
    56: '0x93C9655dD045cd7f5255354cC6F95e21c0C6520f',
  },
  StablePoolFactory: {
    5: '0x7FB72Bf3F5b7f994CC1563FDd47E9Edc13b6Be15',
    // 56: '0x072a48eEADd2eb0E44A0A1Fd237A87F3CBF81bDa', // V1
    56: '0x9e2850729A4d44B1D862bEDF7CE458d71F10aC37',
  },
  StablePhantomPoolFactory: {
    5: '0x7B10Ff68C0b6feB8E1C72D8657eCDF4e1b29fFb8',
    56: '0x072a48eEADd2eb0E44A0A1Fd237A87F3CBF81bDa',
  },
  MetaStablePoolFactory: {
    5: '',
    56: '0x1Af7cB48ACa54a3d94929204e7961B356FCA8636',
  },
  QueryProcessor: {
    5: '',
    56: '0x0ab5941D13c04A6Fa1c4F3F0a500d0c827145aDC',
  },
  ERC4626LinearPoolFactory: {
    5: '',
    56: '',
  },
  SingleRecipientGauge: {
    5: '0x496f704178783eb7a3FaDA82De2d8e62bFd86800',
    // 56: '0x7c1f0f94c26CBef858F3278f92A884853c03dBe6', // factory implementation
    56: '0x1DdAC329f570dF5d83DfAC1720828276Ca49b129', // actual instance
  },
  SingleRecipientGaugeFactory: {
    5: '0x00534e6eAbB8Bc3e67cf8414F7D0D99Ba39837bb',
    56: '0x8D4816ee4EE4cDa7C90e85D9f894809914E695Df',
  },
  BalTokenHolder: {
    5: '0x8C5A8b10A34Ef7F0027F8672f0200751ff5117Db',
    56: '0xd19A924880f74E4e7e53D15aDEB11C6792313669',
  },
  Multicall: {
    5: '0x1050Bcfb2ec4CAe624BD1Eec5dadc2a3b4f4559a',
    56: '0x4Ba82B21658CAE1975Fa26097d87bd48FF270124',
  },
  BatchRelayerLibrary: {
    5: '',
    56: '0x5BcB2fBa3f757FF32cf3BB508790EeD51C05155b',
  },
  BalancerRelayer: {
    // deployed by BatchRelayerLibrary
    56: '0x558BDC96018B9C3dc46481c04B212465D6A69fF0',
  },
  BalHelpers: {
    5: '',
    56: '',
  },
  RewardBridge: {
    5: '',
    56: '',
  },
  BNBxManager: {
    5: '',
    56: '',
  },
  VestingContract: {
    56: '0xd4afeAe1D8E7b88F334d175c56604e2Bf34cc8eF',
  },
  VertekFeeManagement: {
    56: '0x7aa7423541fBC1Cf7Fb2F5d979f39aF00ED50eeE',
  },
  VertekAdminActions: {
    56: '0x85b3062122Dda49002471500C0F559C776FfD8DD', // Impl: 0x9aad96b85dafe8c2f5d9f74f9de93c9784c8c6db, proxy admin: 0xdD2EfD2e3D0C02FF339080CC8ceFE91369b460be
  },
  BribeManager: {
    56: '0xb1B1695FeA2E3a8B2aAE3A0d2a59Ea3F5e4A7508', // admin address 0x6Cb1342CA61b859feF05442ee23ff553C2B1b06c
  },
  MerkleOrchard: {
    56: '0x27eDCe99d5aF44318358497fD5Af5C8e312F1721', // admin address 0x6Cb1342CA61b859feF05442ee23ff553C2B1b06c
  },
};
