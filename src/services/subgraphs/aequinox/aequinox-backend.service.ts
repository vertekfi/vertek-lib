import { config } from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import { join } from 'path';
import { GetPoolsQuerySdk } from './generated/aequinox-subgraph-types';

class AequinoxBackendClient {
  private readonly gqlClient: GraphQLClient;

  constructor() {
    config({ path: join(process.cwd(), '.env') });

    this.gqlClient = new GraphQLClient(process.env.AEQ_SUBGRAPH_URL);
  }

  async getPools() {
    const { GetPools } = await GetPoolsQuerySdk(this.gqlClient);
    return GetPools;
  }
}

export const aequinoxClient = new AequinoxBackendClient();
