import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { StorageModule } from 'storage/storage.module';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { QueueName } from 'shared/constants/queue.constant';
import { RedisModule } from 'redis/redis.module';
import { GoogleWorkspaceModule } from 'external/google-workspace/google-workspace.module';
import { GoogleWorkspaceService } from 'external/google-workspace/google-workspace.service';

@Module({
  imports: [
    StorageModule.getMySQLModule(),
    BullModule.registerQueue({ name: QueueName.STAFF }),
    RedisModule,
    GoogleWorkspaceModule,
  ],
  controllers: [StaffController],
  providers: [StaffService, GoogleWorkspaceService],
})
export class StaffModule {}
