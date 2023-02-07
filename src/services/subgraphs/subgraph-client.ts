import { config } from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import { join } from 'path';
import { SUBGRAPHS, SUBGRAPHS_V2 } from 'src/data/vertek/addresses';

export class SubgraphClient {
  readonly gaugeClientV1: GraphQLClient;
  readonly dexClientV1: GraphQLClient;
  readonly gaugeClientV2: GraphQLClient;
  readonly dexClientV2: GraphQLClient;
  readonly vertekBackendClient: GraphQLClient;

  constructor() {
    config({ path: join(process.cwd(), '.env') });
    console.log(SUBGRAPHS_V2.GAUGES[parseInt(process.env.CHAIN_ID)]);
    this.gaugeClientV2 = new GraphQLClient(
      SUBGRAPHS_V2.GAUGES[parseInt(process.env.CHAIN_ID)],
    );
    this.dexClientV2 = new GraphQLClient(
      SUBGRAPHS_V2.BAL[parseInt(process.env.CHAIN_ID)],
    );
    this.gaugeClientV1 = new GraphQLClient(
      SUBGRAPHS.GAUGES[parseInt(process.env.CHAIN_ID)],
    );
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
