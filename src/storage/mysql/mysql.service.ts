import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from 'shared/constants/env-key.constant';

@Injectable()
export class MysqlService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const type = 'mysql';
    const host = this.configService.get<string>(EnvKey.DB_HOST);
    const port = +(this.configService.get<string>(EnvKey.DB_PORT) || '3306');
    const username = this.configService.get<string>(EnvKey.DB_USER);
    const password = this.configService.get<string>(EnvKey.DB_PASSWORD);
    const database = this.configService.get<string>(EnvKey.DB_NAME);

    return {
      type,
      host,
      port,
      username,
      password,
      database,
      cache: true,
      entities: ['dist/storage/entities/*.js'],
      migrations: ['dist/storage/migrations/*.js'],
      migrationsRun: true,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
      retryAttempts: 10,
      retryDelay: 5000,
    };
  }
}
