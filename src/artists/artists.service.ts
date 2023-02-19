import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UtilsService } from '../utils/utils.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

import { ENTITY_NAME } from '../utils/utils.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService extends UtilsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {
    super();
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };

    return await (<Promise<Artist>>this.createElement(this.artistsRepository, artist));
  }

  async findAll(): Promise<Artist[]> {
    return await (<Promise<Artist[]>>this.findAllElements(this.artistsRepository));
  }

  async findOne(id: string, isFavs?: boolean): Promise<Artist> {
    return await (<Promise<Artist>>(
      this.findElement(this.artistsRepository, id, ENTITY_NAME.ARTIST, isFavs)
    ));
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    return <Promise<Artist>>(
      this.updateElement(this.artistsRepository, id, ENTITY_NAME.ARTIST, updateArtistDto)
    );
  }

  async remove(id: string): Promise<void> {
    const artist = await this.findOne(id);

    await this.removeElement(this.artistsRepository, artist);
  }
}
