import { getTokenAddress } from 'src/utils/contract.utils';

export const VEVRTK_PERCENT = 0.25;
export const STABLE_GAUGE_PERCENT = 0.5;
export const TREASURY_PERCENT = 0.25;

export const VERTEK_TREASURY_ADDRESS =
  '0xA8AAe7bEB83d62eb908F8F1F833A83407e0E04a6';

// Nice multisig setup to manage that
export const STABLE_GAUGE_TOKEN_HOLDER_ACCOUNT =
  '0xe9f07b2481307020B7E5A42Ab4ebF7233AC6FC98';

export const STABLE_ADDRESSES = [
  getTokenAddress('BUSD'),
  getTokenAddress('USDC'),
  getTokenAddress('USDT'),
  getTokenAddress('FRAX'),
  getTokenAddress('TUSD'),
  getTokenAddress('DAI'),
].map((t) => t.toLowerCase());

export const BLUECHIP_ADDRESSES = [
  getTokenAddress('ETH'),
  getTokenAddress('WBNB'),
  getTokenAddress('WBTC'),
].map((t) => t.toLowerCase());

export const SWAP_CONFIGS = [
  {
    tokenIn: getTokenAddress('AMES'),
    tokenOut: getTokenAddress('BUSD'),
  },
  {
    tokenIn: getTokenAddress('wAALTO'),
    tokenOut: getTokenAddress('BUSD'),
  },
  {
    tokenIn: getTokenAddress('UP'),
    tokenOut: getTokenAddress('BUSD'),
  },
].map((t) => {
  return {
    tokenIn: t.tokenIn.toLowerCase(),
    tokenOut: t.tokenOut,
  };
});

export const MIN_SWAP_VALUE = 2;
