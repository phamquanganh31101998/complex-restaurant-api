import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlService } from './mysql/mysql.service';
import { Staff } from './entities/Staff.entity';

@Module({
  providers: [MysqlService],
})
export class StorageModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StorageModule,
      imports: [TypeOrmModule.forRootAsync({ useClass: MysqlService })],
    };
  }

  static getMySQLModule(): DynamicModule {
    return TypeOrmModule.forFeature([Staff]);
  }
}
