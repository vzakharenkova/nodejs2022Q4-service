import { Module } from '@nestjs/common';

import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, TracksService, ArtistsService, AlbumsService],
})
export class FavoritesModule {}
