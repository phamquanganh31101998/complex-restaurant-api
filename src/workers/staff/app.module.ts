import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { StorageModule } from 'storage/storage.module';
import { RedisModule } from 'redis/redis.module';
import { RedisService } from 'redis/redis.service';
import { QueueName } from 'shared/interfaces/queue.interface';

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
        };
      },
    }),
    BullModule.registerQueue({ name: QueueName.STAFF }),
  ],
})
export class AppModule {}
