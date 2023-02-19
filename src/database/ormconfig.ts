import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { Album } from '../albums/entities/album.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { Track } from '../tracks/entities/track.entity';
import { User } from '../users/entities/user.entity';

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Album, Artist, Track, Favorite],
  migrationsRun: true,
  synchronize: false,
};
