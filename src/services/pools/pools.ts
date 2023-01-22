import { Contract, ContractReceipt } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { CreateWeightedPoolArgs } from 'src/types/pool.types';
import { getSigner } from 'src/utils/account.util';
import { getContractAddress } from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import {
  completeWeightedSetup,
  createConfigWeightedPool,
} from './pool-creation';

export async function runPoolsSetup() {
  await createConfigWeightedPool(3);
  // await completeWeightedSetup('0x75f981cC341b29657901379903c0164051a52495');
}
