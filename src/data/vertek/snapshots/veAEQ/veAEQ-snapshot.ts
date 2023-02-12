import * as fs from 'fs-extra';
import { gql } from 'graphql-request';
import { join } from 'path';
import { subgraphService } from 'src/services/subgraphs/subgraph-client';
import { getSigner } from 'src/utils/account.util';
import { Contract } from 'ethers';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import {
  CsvHeader,
  csvService,
} from 'src/services/standalone-utils/csv.service';

const blockNumber = 22721125;
const blockTimestamp = 1667430905;
const veSupplyAtTimestamp = 785293.37368279011718924;

const baseSnapshotPath = join(
  process.cwd(),
  'src/data/vertek/snapshots/veAEQ/',
);
const snapshotPath = join(baseSnapshotPath, 'veAEQ-snapshot.json');
const validPath = join(baseSnapshotPath, 'valid-veAEQ-locks.json');
const expiredPath = join(baseSnapshotPath, 'expired-veAEQ-locks.json');

export async function doVeAeqSnapshot() {
  // await takeTotalSnapshot()
  // await getUsersBalancesAtTimestamp();
  // await filterLocks();
  // await getValidUsersPercentOwnedAtTimestamp();
  // await createLocksCSV();
}

async function takeTotalSnapshot() {
  const locks = await subgraphService.gaugeClientV1.request(gql`
    query {
      votingEscrowLocks(block: { number: ${blockNumber} }, first: 1000) {
        user {
          id
        }
        unlockTime
        lockedBalance
        updatedAt
      }
    }
  `);

  locks.votingEscrowLocks.forEach((l) => {
    l.user = l.user.id;
    l.unlockTime = parseInt(l.unlockTime);
    l.unlockDateUTC = new Date(l.unlockTime * 1000).toUTCString();
    l.lockedBalance = parseFloat(l.lockedBalance);
    l.updatedAt = new Date(parseInt(l.updatedAt) * 1000).toDateString();
  });

  fs.writeJSONSync(snapshotPath, locks.votingEscrowLocks);
}

async function filterLocks() {
  // expired before the block timestamp
  const locks = getTotalSnapshots();
  const valid = locks.filter((l) => l.unlockTime >= blockTimestamp);
  const expired = locks.filter((l) => l.unlockTime < blockTimestamp);

  saveValidSnapshots(valid);
  saveExpiredSnapshots(expired);
}

async function getValidUsersPercentOwnedAtTimestamp() {
  let totalPercent = 0;
  let totalAmounts = 0;

  const validLocks = getValidSnapshots();

  validLocks.forEach((l) => {
    l.percentOwned = trimDecimals(
      trimDecimals(l.userBalanceAtTimestamp, 12) /
        trimDecimals(veSupplyAtTimestamp, 12),
      6,
    );

    const percent = wrapEthNum(l.percentOwned);
    l.percentOwned = percent;
    totalPercent += percent;
    totalAmounts += l.userBalanceAtTimestamp;
  });

  console.log(totalPercent);

  saveValidSnapshots(validLocks);
}

async function getUsersBalancesAtTimestamp(locks: any[]) {
  const { provider } = await getSigner();
  const ve = new Contract(
    '0x06Aba6E8F69A0Be680f96D923EFB682E63Db6a9f',
    [
      'function totalSupplyAt(uint256) public view returns (uint256)',
      'function totalSupply(uint256) public view returns (uint256)',
      'function balanceOf(address, uint256) public view returns (uint256)',
    ],
    provider,
  );

  for (const lock of locks) {
    lock.userBalanceAtTimestamp = Number(
      formatEther(await ve.balanceOf(lock.user, blockTimestamp)),
    );
  }
  console.log('DONE');

  locks.sort((l1, l2) =>
    l1.userBalanceAtTimestamp <= l2.userBalanceAtTimestamp ? 1 : -1,
  );

  return locks;
}

async function createLocksCSV() {
  // all locks
  const allLocks: any[] = fs.readJSONSync(snapshotPath);
  const allCsvPath = join(
    baseSnapshotPath,
    'all-veAEQ-locks-at-block-22721125.csv',
  );
  const allHeaders: CsvHeader[] = [
    { id: 'user', title: 'User' },
    { id: 'unlockDateUTC', title: 'Unlock Date (UTC)' },
    { id: 'updatedAt', title: 'Lock last updated' },
    { id: 'userBalanceAtTimestamp', title: 'veAEQ Balance at block 22721125' },
  ];

  await csvService.write(allCsvPath, allHeaders, allLocks);

  // valid
  let validLocks = getValidSnapshots();
  const validCsvPath = join(
    baseSnapshotPath,
    'valid-veAEQ-locks-at-block-22721125.csv',
  );
  const validHeaders: CsvHeader[] = allHeaders.concat([
    { id: 'percentOwned', title: 'Total veAEQ % Owned' },
  ]);
  validLocks.forEach((l) => (l.percentOwned = l.percentOwned * 100));
  validLocks = validLocks.filter((l) => l.percentOwned > 0);
  await csvService.write(validCsvPath, validHeaders, validLocks);

  // expired
  const expiredLocks = getExpiredSnapshots();
  const expiredCsvPath = join(
    baseSnapshotPath,
    'expired-veAEQ-locks-at-block-22721125.csv',
  );
  await csvService.write(expiredCsvPath, allHeaders, expiredLocks);
}

function trimDecimals(value: number, precision: number) {
  return Number(value.toFixed(precision));
}

function wrapEthNum(val: number) {
  return Number(formatEther(parseUnits(String(val))));
}

function getTotalSnapshots(): any[] {
  return fs.readJSONSync(snapshotPath);
}

function getExpiredSnapshots(): any[] {
  return fs.readJSONSync(expiredPath);
}

function getValidSnapshots(): any[] {
  return fs.readJSONSync(validPath);
}

function saveTotalSnapshots(data: any[]) {
  return fs.writeJSONSync(snapshotPath, data);
}

function saveExpiredSnapshots(data: any[]) {
  return fs.writeJSONSync(expiredPath, data);
}

function saveValidSnapshots(data: any[]) {
  return fs.writeJSONSync(validPath, data);
}
