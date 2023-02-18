import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [path.join(__dirname, '**', 'entities', '*.entity.{ts,js}')],
  //   migrationsRun: true,
  synchronize: false,
};
