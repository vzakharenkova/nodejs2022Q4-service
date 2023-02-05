import { Module } from '@nestjs/common';

import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, FavoritesService, TracksService, AlbumsService],
})
export class ArtistsModule {}
