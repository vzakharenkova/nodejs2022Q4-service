import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { db } from '../database/db';
import { ENTITY, ENTITY_NAME } from '../utils/utils.model';
import { UtilsService } from '../utils/utils.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, ALBUM_FIELDS } from './entities/album.entity';

@Injectable()
export class AlbumsService extends UtilsService {
  private readonly albums: Album[] = db.albums;

  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>, // @Inject(forwardRef(() => FavoritesService)) // private favoritesService: FavoritesService, // @Inject(forwardRef(() => TracksService)) // private tracksService: TracksService,
  ) {
    super();
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };

    return await (<Promise<Album>>this.createElement(this.albumsRepository, album));
  }

  async findAll(): Promise<Album[]> {
    return await (<Promise<Album[]>>this.findAllElements(this.albumsRepository));
  }

  async findOne(id: string, isFavs?: boolean): Promise<Album> {
    return await (<Promise<Album>>(
      this.findElement(this.albumsRepository, id, ENTITY_NAME.ALBUM, isFavs)
    ));
  }

  async findMany(
    id: string,
    searchField: ALBUM_FIELDS.ARTIST_ID | ALBUM_FIELDS.ID,
  ): Promise<Album[]> {
    return <Album[]>this.findElementsByCriterium(ENTITY.ALBUMS, id, searchField);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    return await (<Promise<Album>>(
      this.updateElement(this.albumsRepository, id, ENTITY_NAME.ALBUM, updateAlbumDto)
    ));
  }

  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);

    // if (await this.favoritesService.findOne(id, 'albums', 'id')) {
    //   this.favoritesService.remove(ENTITY.ALBUMS, id, ENTITY_NAME.ALBUM);
    // }

    // const albumTracks = await this.tracksService.findMany(id, TRACK_FIELDS.ALBUM_ID);

    // albumTracks.forEach((track) => this.tracksService.update(track.id, { albumId: null }));

    await this.removeElement(this.albumsRepository, album);
  }
}
