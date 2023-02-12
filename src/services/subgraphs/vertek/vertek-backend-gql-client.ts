import { config } from 'dotenv';
import { gql, GraphQLClient } from 'graphql-request';
import { join } from 'path';
import {
  AdminGetAllPendingFeeDataDocument,
  getSdk,
} from './generated/vertek-subgraph-types';

export class VertekBackendGqlClient {
  readonly gqlClient: GraphQLClient;

  get sdk() {
    return getSdk(this.gqlClient);
  }

  constructor() {
    config({ path: join(process.cwd(), '.env') });

    this.gqlClient = new GraphQLClient(process.env.VERTEK_BACKEND_URL, {
      headers: {
        ADMIN_API_KEY: process.env.ADMIN_API_KEY,
      },
    });
  }

  /**
   * Gets all pool tokens(BPT's) from Vertek backend
   * @returns
   */
  async getAllPendingProtocolFees() {
    const { adminGetAllPendingFeeData } =
      await this.sdk.AdminGetAllPendingFeeData();
    return adminGetAllPendingFeeData;
  }

  async getPool(poolId: string) {
    const { poolGetPool } = await this.sdk.GetPool({
      id: poolId,
    });

    return poolGetPool;
  }
}

export const vertekBackendClient = new VertekBackendGqlClient();

export const getVertekGqlSdk = () =>
  getSdk(
    new GraphQLClient(process.env.VERTEK_BACKEND_URL, {
      headers: {
        ADMIN_API_KEY: process.env.ADMIN_API_KEY,
      },
    }),
  );
