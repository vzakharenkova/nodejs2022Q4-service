import * as path from 'path';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './ormconfig';

export default new DataSource({
  ...typeOrmConfig,
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
});
