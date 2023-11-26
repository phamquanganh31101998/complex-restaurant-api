import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { JobName, QueueName } from 'shared/constants/queue.constant';
import { Job } from 'bullmq';

@Processor(QueueName.STAFF)
export class AppProcessor extends WorkerHost {
  logger = new Logger(AppProcessor.name);

  constructor() {
    super();
  }

  async process(job: Job<unknown, void, JobName>): Promise<void> {
    try {
      this.logger.verbose(
        `Processing job with name: ${job.name}, id: ${job.id}`,
      );
      switch (job.name) {
        case JobName.STAFF_CHECK_IN_SUMMARY_CALCULATION:
          await this.handleCalculateCheckInSummary(job);
          break;
        default:
          this.logger.error('unknown job');
      }
    } catch (e) {
      this.logger.error(`Job ${job.id} failed with error:`);
      this.logger.error(e);

      // throw error announcing bullmq to retry this job
      throw e;
    }
  }

  async handleCalculateCheckInSummary(job: Job) {
    console.log(`Yo let's process this ${job.id}`);
  }
}
