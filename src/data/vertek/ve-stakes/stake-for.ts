import { join } from 'path';
import * as fs from 'fs-extra';
import { CsvHeader, csvService } from 'src/services/csv.service';

const csvReadFilePath = join(
  process.cwd(),
  'src/data/vertek/ve-stakes/dynamo_stake_for_snapshot.csv',
);

const outputDataDir = join(process.cwd(), 'src/data/vertek/ve-stakes/');

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

  await fs.writeJSON(join(outputDataDir, 'stake-for.json'), output);

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
