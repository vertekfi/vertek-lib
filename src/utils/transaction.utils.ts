import { ContractTransaction } from 'ethers';
import { logger } from './logger';

export async function doTransaction(txResponse: ContractTransaction) {
  try {
    return awaitTransactionComplete(await txResponse);
  } catch (error) {
    throw error;
  }
}

export async function awaitTransactionComplete(
  txResponse: ContractTransaction,
  confirmations = 1,
) {
  try {
    txResponse = await txResponse;
    logger.info(`- Starting transaction: ${txResponse.hash}`);
    logger.info(
      `- Awaiting transaction receipt with (${confirmations}) confirmations... - ` +
        new Date().toLocaleString(),
    );

    const txReceipt = await txResponse.wait(confirmations);
    logger.info(
      '- TransactionReceipt received - ' + new Date().toLocaleString(),
    );
    // success
    if (txReceipt.status === 1) {
      logger.success(`Transaction successful`);
    }

    return txReceipt;
  } catch (error) {
    throw error; // Throw and try to let this be handled back in the call stack as needed
  }
}

export async function sleep(ms = 3000) {
  logger.info(`Sleeping for ${ms / 1000} seconds..`);
  return new Promise((res) => setTimeout(res, ms));
}
