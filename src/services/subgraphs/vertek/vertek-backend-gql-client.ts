import { config } from 'dotenv';
import { gql, GraphQLClient } from 'graphql-request';
import { join } from 'path';
import { getSdk } from './generated/vertek-subgraph-types';

export class VertekBackendGqlClient {
  private readonly gqlClient: GraphQLClient;

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

  /**
   * Gets all pool and standard tokens from backend.
   * Filters out any problem causing tokens in the process.
   */
  async getAllTokenAddressesMap() {
    const [standardTokens, pools] = await Promise.all([
      this.sdk.GetAllTokens(),
      await this.sdk.GetAllPools(),
    ]);
    const { tokenGetTokens } = standardTokens;
    const { poolGetPools } = pools;

    // filter out native and BNBx(for some reason fails)
    const tokens = tokenGetTokens
      .filter(
        (a) =>
          a.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' &&
          a.address != '0x7276241a669489e4bbb76f63d2a43bfe63080f2f',
      )
      .map((t) => {
        return {
          address: t.address,
        };
      });

    const poolTokens = poolGetPools
      .filter(
        (p) =>
          p.id !==
          '0x93c9655dd045cd7f5255354cc6f95e21c0c6520f000000000000000000000018',
      )
      .map((p) => {
        return {
          address: p.address,
        };
      });

    return {
      mappedAddress: tokens.concat(poolTokens),
      tokens,
      poolTokens,
    };
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
