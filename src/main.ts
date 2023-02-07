import { config } from 'dotenv';
import { join } from 'path';
import { ScheduledJobService } from './services/automation/scheduled-job.service';

config({ path: join(process.cwd(), '.env') });

async function run() {
  console.log('VertekFi run:');
  await runSetup();
  //
  //
}

async function runSetup() {
  const jobService = new ScheduledJobService();
  jobService.init();
}

run();
