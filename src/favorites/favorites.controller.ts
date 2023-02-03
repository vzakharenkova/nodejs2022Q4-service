import { Controller, Get, Post, Param, Delete, UseFilters, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { HttpExceptionFilter } from 'src/utils/http-exception.filter';
import { Favorite } from './entities/favorite.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Track } from 'src/tracks/entities/track.entity';

@Controller('favs')
@UseFilters(new HttpExceptionFilter())
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('track/:id')
  createTrackFav(@Param('id') id: string): Promise<Track[]> {
    return this.favoritesService.addTrack(id);
  }

  @Post('album/:id')
  createAlbumFav(@Param('id') id: string): Promise<Album[]> {
    return this.favoritesService.addAlbum(id);
  }

  @Post('artist/:id')
  createArtistFav(@Param('id') id: string): Promise<Artist[]> {
    return this.favoritesService.addArtist(id);
  }

  @Get()
  findAll(): Promise<Favorite> {
    return this.favoritesService.findAll();
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    return this.favoritesService.removeTrack(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    return this.favoritesService.removeAlbum(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    return this.favoritesService.removeArtist(id);
  }
}
