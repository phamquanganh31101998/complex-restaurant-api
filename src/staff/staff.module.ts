import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { StorageModule } from 'storage/storage.module';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { QueueName } from 'shared/constants/queue.constant';
import { RedisModule } from 'redis/redis.module';

@Module({
  imports: [
    StorageModule.getMySQLModule(),
    BullModule.registerQueue({ name: QueueName.STAFF }),
    RedisModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
