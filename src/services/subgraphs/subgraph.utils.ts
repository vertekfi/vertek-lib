import { gql } from 'graphql-request';
import { subgraphService } from './subgraph-client';
import { GqlAllFeesData } from './vertek/generated/vertek-subgraph-types';

/**
 * Gets all pool tokens(BPT's) from Vertek backend
 * @returns
 */
export async function getAllPendingProtocolFees(): Promise<GqlAllFeesData> {
  const { adminGetAllPendingFeeData } = await subgraphService
    .vertekBackendClient.request(gql`
    query {
      adminGetAllPendingFeeData(onlyWithBalances: false) {
        totalValueUSD
        gauges {
          totalValueUSD
          values {
            poolId
            poolAddress
            gauge
            gaugeAddress
            pendingPoolTokensFee
            valueUSD
          }
        }

        feeCollector {
          totalValueUSD
          values {
            poolId
            poolAddress
            token
            amount
            valueUSD
          }
        }
      }
    }
  `);

  return adminGetAllPendingFeeData;
}

export async function getVertekPool(poolId: string) {
  //
}
