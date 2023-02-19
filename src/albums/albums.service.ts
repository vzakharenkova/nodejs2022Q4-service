import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { db } from 'src/database/db';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TRACK_FIELDS } from 'src/tracks/entities/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { ENTITY, ENTITY_NAME } from 'src/utils/utils.model';
import { UtilsService } from 'src/utils/utils.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, ALBUM_FIELDS } from './entities/album.entity';

@Injectable()
export class AlbumsService extends UtilsService {
  private readonly albums: Album[] = db.albums;

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,

    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
  ) {
    super();
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };

    return <Album>this.createElement(ENTITY.ALBUMS, album);
  }

  async findAll(): Promise<Album[]> {
    return this.albums;
  }

  async findOne(id: string, isFavs?: boolean): Promise<Album> {
    return <Album>this.findElement(ENTITY.ALBUMS, id, 'id', ENTITY_NAME.ALBUM, isFavs);
  }

  async findMany(
    id: string,
    searchField: ALBUM_FIELDS.ARTIST_ID | ALBUM_FIELDS.ID,
  ): Promise<Album[]> {
    return <Album[]>this.findElementsByCriterium(ENTITY.ALBUMS, id, searchField);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    return <Album>this.updateElement(ENTITY.ALBUMS, id, ENTITY_NAME.ALBUM, updateAlbumDto);
  }

  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);

    if (await this.favoritesService.findOne(id, 'albums', 'id')) {
      this.favoritesService.remove(ENTITY.ALBUMS, id, ENTITY_NAME.ALBUM);
    }

    const albumTracks = await this.tracksService.findMany(id, TRACK_FIELDS.ALBUM_ID);

    albumTracks.forEach((track) => this.tracksService.update(track.id, { albumId: null }));

    this.removeElement(ENTITY.ALBUMS, album);
  }
}
