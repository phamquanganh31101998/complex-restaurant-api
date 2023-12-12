import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import {
  JobName,
  QueueName,
  StaffJobDataType,
} from 'shared/constants/queue.constant';
import { Job } from 'bullmq';
import { RedisService } from 'redis/redis.service';
import { REDIS_CHECK_IN_PREFIX } from 'shared/constants/redis.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffCheckin } from 'storage/entities/Staff-Checkin.entity';
import { Repository } from 'typeorm';

@Processor(QueueName.STAFF)
export class AppProcessor extends WorkerHost {
  logger = new Logger(AppProcessor.name);

  constructor(
    private redisService: RedisService,
    @InjectRepository(StaffCheckin)
    private staffCheckInRepository: Repository<StaffCheckin>,
  ) {
    super();
  }

  async process(job: Job<StaffJobDataType, void, JobName>): Promise<void> {
    try {
      this.logger.verbose(
        `Processing job with name: ${job.name}, id: ${job.id}`,
      );
      switch (job.name) {
        case JobName.STAFF_STORE_CHECKIN_INFO:
          await this.storeCheckinInfo(job);
          break;
        default:
          this.logger.error('unknown job');
      }
    } catch (e) {
      this.logger.error(`Job ${job.id} failed with error:`);
      this.logger.error(e);

      // throw error to announce BullMQ to retry this job
      throw e;
    }
  }

  // Process for every 5 minutes
  // Write temporary checkin info from Redis to DB
  async storeCheckinInfo(job: Job<StaffJobDataType, void, JobName>) {
    // key format: check-in:[2023-12-03]:[id]
    const date = job.id;
    const allRedisCheckinData = await this.redisService.redis.keys(
      `*${REDIS_CHECK_IN_PREFIX}:${date}*`,
    );

    const checkinDataList: ICheckinData[] = [];

    // prepare data
    for (const key of allRedisCheckinData) {
      const redisCheckinData: string[] = JSON.parse(
        await this.redisService.redis.get(key),
      );

      const id = parseInt(key.split(':')[2]);

      checkinDataList.push({
        redisKey: key,
        staffId: id,
        date,
        checkinTimeArr: redisCheckinData,
      });
    }

    const redisTransaction = this.redisService.redis.multi();

    // function handle update to DB and delete from Redis
    const updateCheckinData = async (redisCheckinData: ICheckinData) => {
      const { redisKey, staffId, date, checkinTimeArr } = redisCheckinData;
      const currentCheckInData = await this.staffCheckInRepository.findOne({
        where: {
          staffId,
          date,
        },
      });

      // If staff has not checkin yet, store their checkin info
      if (!currentCheckInData) {
        const checkinTime = checkinTimeArr[0];
        const checkoutTime =
          checkinTimeArr.length > 1
            ? checkinTimeArr[checkinTimeArr.length - 1]
            : null;
        await this.staffCheckInRepository.save({
          staffId,
          date,
          checkinTime,
          checkoutTime,
        });
      } else {
        // otherwise, only change their checkout time
        const checkoutTime = checkinTimeArr[checkinTimeArr.length - 1];

        await this.staffCheckInRepository.save({
          ...currentCheckInData,
          checkoutTime,
        });
      }

      redisTransaction.del(redisKey);
    };

    await Promise.allSettled(
      checkinDataList.map((data) => updateCheckinData(data)),
    );

    await redisTransaction.exec();

    this.logger.verbose(`Job with name: ${job.name}, id: ${job.id} success!`);
  }
}

interface ICheckinData {
  redisKey: string;
  staffId: number;
  date: string;
  checkinTimeArr: string[];
}
