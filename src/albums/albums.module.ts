import { Module } from '@nestjs/common';

import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { FavoritesService } from '../favorites/favorites.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, FavoritesService, TracksService, ArtistsService],
})
export class AlbumsModule {}
