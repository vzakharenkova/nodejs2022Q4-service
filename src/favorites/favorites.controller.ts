import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';

import { FavoritesService } from './favorites.service';
import { Favorite } from './entities/favorite.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';
import { ENTITY, ENTITY_NAME } from '../utils/utils.model';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('track/:id')
  createTrackFav(@Param('id') id: string): Promise<Track[]> {
    return <Promise<Track[]>>this.favoritesService.add(ENTITY.TRACKS, id, ENTITY_NAME.TRACK);
  }

  @Post('album/:id')
  createAlbumFav(@Param('id') id: string): Promise<Album[]> {
    return <Promise<Album[]>>this.favoritesService.add(ENTITY.ALBUMS, id, ENTITY_NAME.ALBUM);
  }

  @Post('artist/:id')
  createArtistFav(@Param('id') id: string): Promise<Artist[]> {
    return <Promise<Artist[]>>this.favoritesService.add(ENTITY.ARTISTS, id, ENTITY_NAME.ARTIST);
  }

  @Get()
  findAll(): Promise<Favorite> {
    return this.favoritesService.findAll();
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string): Promise<void> {
    return this.favoritesService.remove(ENTITY.TRACKS, id, ENTITY_NAME.TRACK);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string): Promise<void> {
    return this.favoritesService.remove(ENTITY.ALBUMS, id, ENTITY_NAME.ALBUM);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string): Promise<void> {
    return this.favoritesService.remove(ENTITY.ARTISTS, id, ENTITY_NAME.ARTIST);
  }
}
