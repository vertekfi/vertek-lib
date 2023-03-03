import * as schedule from 'node-schedule';
import { join } from 'path';
import { getSignerAddress } from 'src/utils/account.util';
import { getContractAddress } from 'src/utils/contract.utils';
import { logger } from 'src/utils/logger';
import { vertekBackendClient } from '../subgraphs/vertek/vertek-backend-gql-client';
import { createWeekDataDirectory } from './fees/fee-data.utils';
import {
  devAccountPostBalancesFileName,
  devAccountPreBalancesFileName,
  feeAutomation,
  feeCollectorPreWithdrawTotalsName,
  feeDistributionFileName,
} from './fees/fees-automation';

const utcZone = 'Etc/UTC';

export class ScheduledJobService {
  readonly jobs = [];

  constructor() {}

  async init() {
    logger.info(
      'ScheduledJobService: initializing workers - ' + new Date().toUTCString(),
    );
    const feesJob = this.initFeeWithdrawJob();
    feesJob.handler();
    // schedule.scheduleJob(feesJob.rule, function () {
    //   feesJob.handler();
    // });

    logger.success('ScheduledJobService: all workers scheduled');
  }

  // Starting it early so things are ready at epoch start
  private initFeeWithdrawJob() {
    // Wednesdays 11:00pm UTC
    const feeWithdrawRule = new schedule.RecurrenceRule();
    feeWithdrawRule.dayOfWeek = 3; // Wednesday
    feeWithdrawRule.hour = 23; // 11pm UTC
    feeWithdrawRule.minute = 0;
    feeWithdrawRule.tz = utcZone;

    async function handler() {
      try {
        logger.info(
          'Running fee automation job - ' + new Date().toLocaleString(),
        );

        const dataDir = createWeekDataDirectory();
        // Save raw trading and gauge fees from the start
        // const { tradePath, gaugePath } = await feeAutomation.saveRawFeeData(
        //   dataDir,
        // );

        // // Save total trading and gauge fees per BPT
        // feeAutomation.saveTotalFeesPerToken(dataDir, tradePath, gaugePath);

        // // Snapshot dev account balances before fee withdraw
        // // Need to be able to properly account for any amounts already in the account
        // await feeAutomation.doAccountBalanceSnapshot(
        //   join(dataDir, devAccountPreBalancesFileName),
        //   await getSignerAddress(),
        // );

        // Needs to happen first so they go to fee collector
        // Will use the helper contract to withdraw for all gauges
        // TODO: DO NOT UPDATE FEE FILE DATA AFTER THIS
        // await feeAutomation.withdrawGaugeFees(dataDir);

        // Snapshot the balances of the fee collector before
        // withdraw so we know exactly the amounts we're
        // calculating for fees then afterwards
        // const finalCollectorAmountsPath = join(
        //   dataDir,
        //   feeCollectorPreWithdrawTotalsName,
        // );
        // await feeAutomation.doAccountBalanceSnapshot(
        //   finalCollectorAmountsPath,
        //   getContractAddress('ProtocolFeesCollector'),
        // );

        // Then we can trigger the actual withdraw
        // await feeAutomation.doFeeCollectorWithdraw(finalCollectorAmountsPath);

        // Snapshot admin account again in case amounts are needed for reference
        // await feeAutomation.doAccountBalanceSnapshot(
        //   join(dataDir, devAccountPostBalancesFileName),
        //   await getSignerAddress(),
        // );

        // Break up amounts to where they go (stable fund, treasury, veVRTK)
        // feeAutomation.saveFeeDistributionData(
        //   join(dataDir, feeCollectorPreWithdrawTotalsName),
        //   dataDir,
        // );

        // VE holders deposit flow
        // BPT's and VRTK
        // await feeAutomation.doVeFeeDistribution(
        //   join(dataDir, feeDistributionFileName),
        // );

        // This is currently just doing stable fund
        // TODO: Still need to add the one to exit and swap to stables/blue chips for our treasury
        // Do pool exits for stable fund.
        // const { poolGetPools } = await vertekBackendClient.sdk.GetAllPools();

        // await feeAutomation.doPoolTokenExitsForStableFund(
        //   dataDir,
        //   poolGetPools,
        // );

        const tempDir = join(
          process.cwd(),
          'src/data/vertek/fees/20230223-20230301',
        );

        const { tokenGetCurrentPrices } =
          await vertekBackendClient.sdk.GetTokenPrices();

        // const stableAmountsPath =
        //   feeAutomation.saveStableGaugeFundDistribution(dataDir);
        // await feeAutomation.doStableGaugeDistribution(stableAmountsPath);

        const { tokenGetTokens } = await vertekBackendClient.sdk.GetAllTokens();
        // await feeAutomation.doTreasuryPoolExits(tempDir, poolGetPools);
        await feeAutomation.doTreasurySwaps(
          tempDir,
          tokenGetTokens,
          tokenGetCurrentPrices,
        );

        // await feeAutomation.run();
      } catch (error) {
        console.log(error);
        logger.error('Fee automation job: failed');
      }
    }

    return {
      rule: feeWithdrawRule,
      handler,
    };
  }

  private initGaugeEpochEndCheckpointJob() {
    // Wednesdays 11:30pm UTC
    const gaugeCheckpointRule = new schedule.RecurrenceRule();
    gaugeCheckpointRule.dayOfWeek = 3; // Wednesday
    gaugeCheckpointRule.hour = 23; // 11pm UTC
    gaugeCheckpointRule.minute = 30; // Leave time for retries
    gaugeCheckpointRule.tz = utcZone;

    async function handler() {
      // checkpoint all gauges (or just the stakeless? All for now)
      // checkpoints gauge controller as well
      try {
        logger.info(
          'Running gauge epoch end job - ' + new Date().toLocaleString(),
        );
      } catch (error) {
        console.log(error);
        logger.error('Gauge Epoch End Checkpoint Job: failed');
      }
    }

    return {
      rule: gaugeCheckpointRule,
      handler,
    };
  }

  private initEpochStartCheckpointsJob() {
    // Thursdays 12:00:30am UTC
    const checkpointsRule = new schedule.RecurrenceRule();
    checkpointsRule.dayOfWeek = 4; // Thursday
    checkpointsRule.hour = 0; // 12am UTC
    checkpointsRule.minute = 0; // Give RPC node time/space in case
    checkpointsRule.second = 30;
    checkpointsRule.tz = utcZone;

    async function handler() {
      logger.info(
        'Running epoch start checkpoints job - ' + new Date().toLocaleString(),
      );
      // TODO: This is where adjustments to type weight would happen to keep ve gauge at 65% (manual for now I guess to not fuck it up)
      // fee dist checkpoint. Will also checkpoint voting escrow in the process in the contract
      // checkpoint controller to next epoch start
      // gauges also?

      try {
        // await checkpointAllGauges();
        // await checkpointStakelessGauge();
        // await checkpointFeeDistributor();
      } catch (error) {
        console.log(error);
        logger.error('Epoch start checkpoints job: failed');
      }
    }

    return {
      rule: checkpointsRule,
      handler,
    };
  }
}
