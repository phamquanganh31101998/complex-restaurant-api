import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

// Use for generating the migrations, store in ./migrations/
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ['dist/storage/entities/*.js'],
  migrations: ['dist/storage/migrations/*.js'],
  namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;
