import { getVaultInstance } from 'src/services/vault/vault';

class FeeVaultService {
  constructor() {}

  async exitPool() {
    const vault = await getVaultInstance();
  }
}

export const feeVaultService = new FeeVaultService();
