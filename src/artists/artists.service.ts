import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UtilsService } from '../utils/utils.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { db } from '../database/db';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { ENTITY, ENTITY_NAME } from '../utils/utils.model';
import { ALBUM_FIELDS } from '../albums/entities/album.entity';
import { TRACK_FIELDS } from '../tracks/entities/track.entity';

@Injectable()
export class ArtistsService extends UtilsService {
  private readonly atrists: Artist[] = db.artists;

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,

    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {
    super();
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };

    return <Artist>this.createElement(ENTITY.ARTISTS, artist);
  }

  async findAll(): Promise<Artist[]> {
    return this.atrists;
  }

  async findOne(id: string, isFavs?: boolean): Promise<Artist> {
    return <Artist>this.findElement(ENTITY.ARTISTS, id, 'id', ENTITY_NAME.ARTIST, isFavs);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    return <Artist>this.updateElement(ENTITY.ARTISTS, id, ENTITY_NAME.ARTIST, updateArtistDto);
  }

  async remove(id: string): Promise<void> {
    const artist = await this.findOne(id);

    if (await this.favoritesService.findOne(id, 'artists', 'id')) {
      this.favoritesService.remove(ENTITY.ARTISTS, id, ENTITY_NAME.ARTIST);
    }

    const artistTracks = await this.tracksService.findMany(id, TRACK_FIELDS.ARTIST_ID);
    const artistAlbums = await this.albumsService.findMany(id, ALBUM_FIELDS.ARTIST_ID);

    artistTracks.forEach((track) => this.tracksService.update(track.id, { artistId: null }));
    artistAlbums.forEach((album) => this.albumsService.update(album.id, { artistId: null }));

    this.removeElement(ENTITY.ARTISTS, artist);
  }
}
