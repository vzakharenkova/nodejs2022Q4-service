import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { UtilsService } from 'src/utils/utils.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { db } from 'src/database/db';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistsService extends UtilsService {
  private readonly atrists: Artist[] = db.artists;

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {
    super();
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };

    this.atrists.push(artist);

    return artist;
  }

  async findAll(): Promise<Artist[]> {
    return this.atrists;
  }

  async findOne(id: string, isFavs?: boolean): Promise<Artist> {
    this.validateId(id);

    const artist = this.atrists.find((artist) => artist.id === id);

    if (!artist) {
      isFavs
        ? this.throwUnprocessableEntityException('Artist', id)
        : this.throwNotFoundException('Artist', id);
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);

    const keys = Object.keys(updateArtistDto);

    keys.forEach((key) => (artist[key] = updateArtistDto[key]));

    return artist;
  }

  async remove(id: string) {
    const artist = await this.findOne(id);

    const index = this.atrists.indexOf(artist);

    this.atrists.splice(index, 1);
  }
}
