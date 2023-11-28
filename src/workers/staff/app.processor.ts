import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import {
  JobName,
  QueueName,
  StaffJobData,
  StaffJobDataType,
} from 'shared/constants/queue.constant';
import { Job } from 'bullmq';
import { RedisService } from 'redis/redis.service';
import { REDIS_CHECK_IN_PREFIX } from 'shared/constants/redis.constant';

@Processor(QueueName.STAFF)
export class AppProcessor extends WorkerHost {
  logger = new Logger(AppProcessor.name);

  constructor(private redisService: RedisService) {
    super();
  }

  async process(job: Job<StaffJobDataType, void, JobName>): Promise<void> {
    try {
      this.logger.verbose(
        `Processing job with name: ${job.name}, id: ${job.id}`,
      );
      switch (job.name) {
        case JobName.STAFF_CHECK_IN_SUMMARY_CALCULATION:
          await this.summarizeCheckInTimeDaily(job);
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

  async summarizeCheckInTimeDaily(job: Job<StaffJobDataType, void, JobName>) {
    // key format check-in:[id]
    const allCheckInData = await this.redisService.redis.keys(
      `*${REDIS_CHECK_IN_PREFIX}*`,
    );

    const date = job.data.date as string;
    const idToCheckInDataMapping = new Map<number, [Date, Date]>();

    // prepare data
    for (const key of allCheckInData) {
      const checkInData: string[] = JSON.parse(
        await this.redisService.redis.get(key),
      );

      const id = parseInt(key.split(':')[1]);

      const checkInTime = checkInData[0] ?? null;
      const checkOutTime =
        checkInData.length > 1 ? checkInData[checkInData.length - 1] : null;

      idToCheckInDataMapping.set(id, [
        new Date(checkInTime),
        new Date(checkOutTime),
      ]);
    }
  }
}
