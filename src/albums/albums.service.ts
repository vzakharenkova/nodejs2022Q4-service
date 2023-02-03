import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { db } from 'src/database/db';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksService } from 'src/tracks/tracks.service';
import { UtilsService } from 'src/utils/utils.service';

import { v4 as uuidv4 } from 'uuid';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

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

    this.albums.push(album);

    return album;
  }

  async findAll(): Promise<Album[]> {
    return this.albums;
  }

  async findOne(id: string, isFavs?: boolean): Promise<Album> {
    this.validateId(id);

    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      isFavs
        ? this.throwUnprocessableEntityException('Album', id)
        : this.throwNotFoundException('Album', id);
    }

    return album;
  }

  async findMany(id: string, searchField: string): Promise<Album[]> {
    this.validateId(id);

    return this.albums.filter((album) => album[searchField] === id);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);

    const keys = Object.keys(updateAlbumDto);

    keys.forEach((key) => (album[key] = updateAlbumDto[key]));

    return album;
  }

  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);

    if (await this.favoritesService.findOne(id, 'albums', 'id')) {
      this.favoritesService.removeAlbum(id);
    }

    const albumTracks = await this.tracksService.findMany(id, 'albumId');

    albumTracks.forEach((track) => this.tracksService.update(track.id, { albumId: null }));

    const index = this.albums.indexOf(album);

    this.albums.splice(index, 1);
  }
}
