import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ENTITY_NAME } from '../utils/utils.model';
import { UtilsService } from '../utils/utils.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService extends UtilsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
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

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    return await (<Promise<Album>>(
      this.updateElement(this.albumsRepository, id, ENTITY_NAME.ALBUM, updateAlbumDto)
    ));
  }

  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);

    await this.removeElement(this.albumsRepository, album);
  }
}
