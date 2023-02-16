import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UtilsService } from '../utils/utils.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { db } from '../database/db';

import { ENTITY, ENTITY_NAME } from '../utils/utils.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService extends UtilsService {
  private readonly atrists: Artist[] = db.artists;

  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>, // @Inject(forwardRef(() => FavoritesService)) // private favoritesService: FavoritesService, // @Inject(forwardRef(() => TracksService)) // private tracksService: TracksService, // @Inject(forwardRef(() => AlbumsService)) // private albumsService: AlbumsService,
  ) {
    super();
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };

    // const createdArtist = this.artistsRepository.create(artist);

    // return await this.artistsRepository.save(createdArtist);

    return await (<Promise<Artist>>this.createElement(this.artistsRepository, artist));
  }

  async findAll(): Promise<Artist[]> {
    return await (<Promise<Artist[]>>this.findAllElements(this.artistsRepository));
  }

  async findOne(id: string, isFavs?: boolean): Promise<Artist> {
    // return await this.artistsRepository.findOne({ where: { id } });

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

    // if (await this.favoritesService.findOne(id, 'artists', 'id')) {
    //   this.favoritesService.remove(ENTITY.ARTISTS, id, ENTITY_NAME.ARTIST);
    // }

    // const artistTracks = await this.tracksService.findMany(id, TRACK_FIELDS.ARTIST_ID);
    // const artistAlbums = await this.albumsService.findMany(id, ALBUM_FIELDS.ARTIST_ID);

    // artistTracks.forEach((track) => this.tracksService.update(track.id, { artistId: null }));
    // artistAlbums.forEach((album) => this.albumsService.update(album.id, { artistId: null }));

    await this.removeElement(this.artistsRepository, artist);
  }
}
