import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...typeOrmConfig, autoLoadEntities: true }),
    UsersModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    FavoritesModule,
  ],
})
export class AppModule {}
