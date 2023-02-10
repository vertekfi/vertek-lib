import { gql } from 'graphql-request';
import { subgraphService } from './subgraph-client';

/**
 * Gets all pool tokens(BPT's) from Vertek backend
 * @returns
 */
export async function getAllPendingProtocolFees(): Promise<
  { id: string; address: string; decimals: number; name: string }[]
> {
  const { adminGetAllPendingFeeData } = await subgraphService
    .vertekBackendClient.request(gql`
    query {
      adminGetAllPendingFeeData(onlyWithBalances: true) {
        totalValueUSD
        gauges {
          totalValueUSD
          values {
            poolId
            gauge
            pendingPoolTokensFee
            valueUSD
          }
        }

        feeCollector {
          totalValueUSD
          values {
            poolId
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
