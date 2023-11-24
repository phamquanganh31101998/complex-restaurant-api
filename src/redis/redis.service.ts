import Redis, { RedisOptions } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from '../shared/constants/env-key.constant';

@Injectable()
export class RedisService {
  private readonly redisInstance: Redis;

  constructor(private configService: ConfigService) {
    const redisOptions: RedisOptions = {
      host: this.configService.get<string>(EnvKey.REDIS_HOST),
      port: +this.configService.get<string>(EnvKey.REDIS_PORT),
    };

    this.redisInstance = new Redis(redisOptions);
  }

  get redis(): Redis {
    return this.redisInstance;
  }
}
