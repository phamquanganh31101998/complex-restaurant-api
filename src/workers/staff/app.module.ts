import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { StorageModule } from 'storage/storage.module';
import { RedisModule } from 'redis/redis.module';
import { RedisService } from 'redis/redis.service';
import { QueueName } from 'shared/constants/queue.constant';
import { AppProcessor } from './app.processor';
import { GoogleWorkspaceModule } from 'external/google-workspace/google-workspace.module';
import { GoogleWorkspaceService } from 'external/google-workspace/google-workspace.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.example.env'],
      cache: true,
      isGlobal: true,
    }),
    StorageModule.forRootAsync(),
    StorageModule.getMySQLModule(),
    RedisModule,
    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: async (redisService: RedisService) => {
        return {
          connection: redisService.redis,
        };
      },
    }),
    BullModule.registerQueue({ name: QueueName.STAFF }),
    GoogleWorkspaceModule,
  ],
  providers: [AppProcessor, GoogleWorkspaceService],
})
export class AppModule {}
