import { getAllPoolConfigs } from 'src/services/pools/pool.utils';

export async function getAllGaugeWeights() {
  const pools = await getAllPoolConfigs();
}
