import { join } from 'path';
import * as fs from 'fs-extra';
import { CsvHeader, csvService } from 'src/services/csv.service';
import { parseUnits } from 'ethers/lib/utils';
import { stakeForUser } from 'src/services/gauges/voting-escrow';
import { logger } from 'src/utils/logger';
import { sleep } from 'src/utils/transaction.utils';

const csvReadFilePath = join(
  process.cwd(),
  'src/data/vertek/ve-stakes/dynamo_stake_for_snapshot.csv',
);

const outputDataDir = join(process.cwd(), 'src/data/vertek/ve-stakes/');
const stakeForJsonPath = join(outputDataDir, 'stake-for.json');

export async function getStakeForData() {
  const totalBalance = 5300;
  let totalOut = 0;

  const output = [];
  const data: any[] = await csvService.parseCSV(csvReadFilePath);

  for (const user of data) {
    const percent = user['veAEQ % Owned'];
    const percentNum = parseFloat(percent) / 100;
    const amountOwed = totalBalance * percentNum;
    totalOut += amountOwed;

    output.push({
      user: user['User'],
      'veAEQ % Owned': percent,
      amountOwed,
    });
  }

  console.log('Total amount out: ' + totalOut);

  await fs.writeJSON(stakeForJsonPath, output);

  await csvService.write(
    join(outputDataDir, 'stake-for.csv'),
    [
      {
        id: 'user',
        title: 'User',
      },
      {
        id: 'veAEQ % Owned',
        title: 'veAEQ % Owned',
      },
      {
        id: 'amountOwed',
        title: 'Amount Owed',
      },
    ],
    output,
  );
}

function getLastestIndex(data: any[]) {
  let idx = 0;
  for (const d of data) {
    if (!d.completed) {
      return idx;
    }

    idx++;
  }
}

export async function doStakeFor() {
  try {
    // starting lowest first in case of, anything
    let data: any[] = await fs.readJSON(stakeForJsonPath);

    const start = getLastestIndex(data);
    console.log(start);

    const end = start + 50;

    let runCount = start;
    for (const info of data.slice(start, end)) {
      if (runCount === data.length - 1) {
        logger.error(`End of list reached. Quitting`);
        return;
      }

      if (info.completed) {
        logger.error(`User ${info.user} already staked for.`);
        continue;
      }

      logger.success(`Running stake for index count: ${runCount}`);

      const who = info.user;
      const amount = parseUnits(String(info.amountOwed));
      const endTimeDaysFromNow = 365;

      logger.info(`
      staking for: ${who}
      amountOwed: ${info.amountOwed}`);

      await stakeForUser(who, amount, endTimeDaysFromNow);

      info.completed = true;

      await fs.writeJSON(stakeForJsonPath, data);

      runCount++;

      if (runCount !== end) {
        await sleep(5000);
      } else {
        logger.success(`Stake fors all complete`);
        logger.success(`${data.length - end} stakes left.`);
      }
    }
  } catch (error) {
    logger.error(`Stake for failed`, error);
  }
}

export async function dumpStakeCSV() {
  const data: any[] = (await fs.readJSON(stakeForJsonPath)).reverse();

  await csvService.write(
    join(outputDataDir, 'stake-for.csv'),
    [
      {
        id: 'user',
        title: 'User',
      },
      {
        id: 'veAEQ % Owned',
        title: 'veAEQ % Owned',
      },
      {
        id: 'amountOwed',
        title: 'Amount Owed',
      },
    ],
    data,
  );
}
