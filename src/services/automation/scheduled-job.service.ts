import * as schedule from 'node-schedule';
import { logger } from 'src/utils/logger';

export class ScheduledJobService {
  readonly jobs = [];

  constructor() {}

  init() {}

  private initGaugeEpochEndCheckpointJob() {
    // Wednesdays 6:30pm EST
    const gaugeCheckpointRule = new schedule.RecurrenceRule();
    gaugeCheckpointRule.dayOfWeek = 3; // Wednesday
    gaugeCheckpointRule.hour = 16; // 6pm EST
    gaugeCheckpointRule.minute = 30; // Leave time for retries

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
    // Thursdays 12:30am EST
    const checkpointsRule = new schedule.RecurrenceRule();
    checkpointsRule.dayOfWeek = 4; // Thursday
    checkpointsRule.hour = 0; // 12am EST
    checkpointsRule.minute = 15; // Give RPC node time/space in case

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

  // TODO: Need to finalize and test this flow
  // Starting it early so things are ready at epoch start
  private initFeeWithdrawJob() {
    // Wednesdays 6:00pm EST
    const feeWithdrawRule = new schedule.RecurrenceRule();
    feeWithdrawRule.dayOfWeek = 3; // Thursday
    feeWithdrawRule.hour = 16; // 6pm EST
    feeWithdrawRule.minute = 0;

    async function handler() {
      try {
        logger.info(
          'Running fee with draw job - ' + new Date().toLocaleString(),
        );
        // collect and save data
        // do withdraw
        // exit through vault (Guess we're keeping BPT's instead though)
        // deposit to fee dist
        // part of this is also getting the VRTK from checkpoint stakeless gauge
        // (token holder) to the fee dist for veVRTK people as well then
      } catch (error) {
        console.log(error);
        logger.error('Gauge Epoch End Checkpoint Job: failed');
      }
    }

    return {
      rule: feeWithdrawRule,
      handler,
    };
  }
}
