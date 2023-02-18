import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Album } from '../albums/entities/album.entity';
import { Artist } from '../artists/entities/artist.entity';

import { Track } from '../tracks/entities/track.entity';
import { ENTITY, ENTITY_NAME, UNION_ENTITIES } from '../utils/utils.model';
import { UtilsService } from '../utils/utils.service';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService extends UtilsService {
  private readonly repositoryMap = {
    [ENTITY.ALBUMS]: this.albumsRepository,
    [ENTITY.ARTISTS]: this.artistsRepository,
    [ENTITY.TRACKS]: this.tracksRepository,
  };

  constructor(
    @InjectRepository(Favorite)
    private favsRepository: Repository<Favorite>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {
    super();
  }

  async initFavs() {
    await this.favsRepository.save(new Favorite());
  }

  async add(entity: ENTITY, id: string, name: ENTITY_NAME): Promise<Album[] | Artist[] | Track[]> {
    const element: UNION_ENTITIES = await this.findElement(
      this.repositoryMap[entity],
      id,
      name,
      true,
    );

    const favs = await this.findAll();

    favs[entity].push(element);

    await this.favsRepository.save(favs);

    return favs[entity];
  }

  findIndex(id: string, favsGroupe: Track[] | Album[] | Artist[]): number {
    this.validateId(id);

    return favsGroupe.findIndex((el: Track | Album | Artist) => el.id === id);
  }

  async findAll(): Promise<Favorite> {
    const [favs] = await this.favsRepository.find({
      relations: {
        tracks: true,
        albums: true,
        artists: true,
      },
    });

    if (!favs) {
      await this.initFavs();
      return this.findAll();
    }

    if (!favs) {
      await this.favsRepository.save(new Favorite());
    }

    return favs;
  }

  async remove(entity: ENTITY, id: string, entityName: ENTITY_NAME): Promise<void> {
    const favs = await this.findAll();
    const elementIndex = this.findIndex(id, favs[entity]);

    if (elementIndex < 0) {
      this.throwNotFoundException(entityName, id);
    }

    favs[entity].splice(elementIndex, 1);

    await this.favsRepository.save(favs);
  }
}
