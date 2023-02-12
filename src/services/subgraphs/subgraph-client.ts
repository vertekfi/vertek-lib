import { config } from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import { join } from 'path';
import { SUBGRAPHS, SUBGRAPHS_V2 } from 'src/data/vertek/addresses/addresses';
import { getChainId } from 'src/utils/account.util';

export class SubgraphClient {
  readonly gaugeClientV1: GraphQLClient;
  readonly dexSubgraphClientV1: GraphQLClient;
  readonly gaugeClientV2: GraphQLClient;
  readonly dexSubgraphClientV2: GraphQLClient;
  readonly vertekBackendClient: GraphQLClient;

  constructor() {
    config({ path: join(process.cwd(), '.env') });

    this.gaugeClientV2 = new GraphQLClient(SUBGRAPHS_V2.GAUGES[getChainId()]);

    this.dexSubgraphClientV2 = new GraphQLClient(
      SUBGRAPHS_V2.BAL[getChainId()],
    );

    this.gaugeClientV1 = new GraphQLClient(SUBGRAPHS.GAUGES[getChainId()]);

    this.vertekBackendClient = new GraphQLClient(
      process.env.VERTEK_BACKEND_URL,
      {
        headers: {
          ADMIN_API_KEY: process.env.ADMIN_API_KEY,
        },
      },
    );
  }
}

export const subgraphService = new SubgraphClient();
