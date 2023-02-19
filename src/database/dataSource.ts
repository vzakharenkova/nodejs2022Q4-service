import { DataSource } from 'typeorm';
import { init1676814319755 } from '../migrations/1676814319755-init';
import { typeOrmConfig } from './ormconfig';

export default new DataSource({
  ...typeOrmConfig,
  migrations: [init1676814319755],
  migrationsTableName: 'migrations',
});
