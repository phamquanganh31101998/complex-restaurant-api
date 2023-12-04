import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from 'storage/storage.module';
import { RedisModule } from 'redis/redis.module';
import { RedisService } from 'redis/redis.service';
import { StaffModule } from './staff/staff.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GoogleWorkspaceModule } from './external/google-workspace/google-workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.example.env'],
      cache: true,
      isGlobal: true,
    }),
    StorageModule.forRootAsync(),
    RedisModule,
    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: async (redisService: RedisService) => {
        return {
          connection: redisService.redis,
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true,
            attempts: 3,
            backoff: {
              type: 'fixed',
              delay: 60000, // in milliseconds
            },
          },
        };
      },
    }),
    StaffModule,
    ScheduleModule.forRoot(),
    GoogleWorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
