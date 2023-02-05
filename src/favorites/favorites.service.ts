import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { AlbumsService } from 'src/albums/albums.service';
import { Album } from 'src/albums/entities/album.entity';
import { ArtistsService } from 'src/artists/artists.service';
import { Artist } from 'src/artists/entities/artist.entity';
import { db } from 'src/database/db';
import { Track } from 'src/tracks/entities/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { ENTITY, ENTITY_NAME } from 'src/utils/utils.model';
import { UtilsService } from 'src/utils/utils.service';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService extends UtilsService {
  private readonly favorites: Favorite = db.favorites;

  private readonly serviceMap = {
    [ENTITY.ALBUMS]: this.albumsService,
    [ENTITY.ARTISTS]: this.artistsService,
    [ENTITY.TRACKS]: this.tracksService,
  };

  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,

    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
  ) {
    super();
  }

  async add(entity: ENTITY, id: string): Promise<Album[] | Artist[] | Track[]> {
    const element: Album[] | Artist[] | Track[] = await this.serviceMap[entity].findOne(id, true);

    this.favorites[entity].push(element);

    return this.favorites[entity];
  }

  async findOne(
    id: string,
    searchEntity: string,
    searchField: string,
  ): Promise<Track | Album | Artist> {
    this.validateId(id);

    return this.favorites[searchEntity].find(
      (el: Track | Album | Artist) => el[searchField] === id,
    );
  }

  async findAll(): Promise<Favorite> {
    return this.favorites;
  }

  async remove(entity: ENTITY, id: string, entityName: ENTITY_NAME): Promise<void> {
    const element = await this.findOne(id, entity, 'id');

    if (!element) {
      this.throwNotFoundException(entityName, id);
    }

    this.removeElement(entity, element, true);
  }
}
