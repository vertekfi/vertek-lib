import { BigNumber, Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { GaugeType, GaugeTypeNum } from 'src/types/gauge.types';
import { PoolCreationConfig } from 'src/types/pool.types';
import { getSigner } from 'src/utils/account.util';
import { getContractAddress } from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { awaitTransactionComplete } from 'src/utils/transaction.utils';
import {
  addLiquidityGaugeToController,
  addGaugeTypeToController,
  createLiquidityGauge,
  GaugeFeeType,
  updateGaugeFee,
} from '../gauges/gauge-utils';
import {
  getAllPoolConfigs,
  getMainPoolConfig,
  updatePoolConfig,
} from '../pools/pool.utils';

export async function runGaugeSetup() {
  // await initGaugeAuthItems();
  // await addGaugeTypes();
  // await createConfigPoolGauges();
  // await addConfigPoolGaugesToController();
  // await setGaugeFees();
}

export async function addGaugeTypes() {
  //
  // Note from GaugeAdder contract:
  // Functions for the "LiquidityMiningCommittee" and "veBAL" types are purposefully omitted as there is
  // no reason for new gauges to be deployed for these types, so there is no need to expose methods to add them.
  //
  await addGaugeTypeToController(GaugeType.veBAL, 1);

  // We do not have this "Liquidity Mining Committee" concept right now.
  // Its all ve holders (veBAL gauge type) and "Ethereum" voting gauges (65/35).
  // But adding here to index align with GaugeAdder GaugeType enum.
  await addGaugeTypeToController(GaugeType.LiquidityMiningCommittee, 0);

  // Should be third item in local enum, enum index 2, to line up with contract enum GaugeType.Ethereum
  await addGaugeTypeToController(GaugeType.Ethereum, 1);
}

export async function createConfigPoolGauges() {
  const pools = await getAllPoolConfigs();
  for (const pool of pools) {
    await createLiquidityGauge(pool);
  }
}

export async function addConfigPoolGaugesToController() {
  const pools = await getAllPoolConfigs();
  for (const pool of pools) {
    await addLiquidityGaugeToController(
      pool,
      GaugeTypeNum.Ethereum,
      BigNumber.from(0),
    );
  }
}

export async function addMainPoolGaugeSetup() {
  try {
    // SingleRecipientGauge type (can not be voted for)
    const mainPool = await getMainPoolConfig();
    if (mainPool.gauge.added) {
      logger.error('Main pool gauge already created');
      return;
    }

    const singleFactory = new Contract(
      getContractAddress('SingleRecipientGaugeFactory'),
      [
        'function create(address recipient, uint256 relativeWeightCap) external returns (address)',
      ],
      await getSigner(),
    );

    const receipt = await awaitTransactionComplete(
      singleFactory.create(getContractAddress('BalTokenHolder'), 0),
    );

    mainPool.gauge.added = true;
    mainPool.gauge.address = receipt.events[1].address;
    mainPool.gauge.txHash = receipt.transactionHash;
    await updatePoolConfig(mainPool);

    // add to controller
    await await addLiquidityGaugeToController(
      mainPool,
      GaugeTypeNum.veBAL,
      parseUnits('0.65'),
    );
  } catch (error) {
    console.error(error);
  }
}
