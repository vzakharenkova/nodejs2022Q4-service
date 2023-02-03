import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { FavoritesService } from 'src/favorites/favorites.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, FavoritesService, TracksService, ArtistsService],
})
export class AlbumsModule {}
