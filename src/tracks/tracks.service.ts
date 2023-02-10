import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { db } from '../database/db';
import { ENTITY, ENTITY_NAME } from '../utils/utils.model';
import { UtilsService } from '../utils/utils.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track, TRACK_FIELDS } from './entities/track.entity';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TracksService extends UtilsService {
  private readonly tracks: Track[] = db.tracks;

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {
    super();
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };

    return <Track>this.createElement(ENTITY.TRACKS, track);
  }

  async findAll(): Promise<Track[]> {
    return this.tracks;
  }

  async findOne(id: string, isFavs?: boolean): Promise<Track> {
    return <Track>this.findElement(ENTITY.TRACKS, id, 'id', ENTITY_NAME.TRACK, isFavs);
  }

  async findMany(
    id: string,
    searchField: TRACK_FIELDS.ARTIST_ID | TRACK_FIELDS.ALBUM_ID | TRACK_FIELDS.ID,
  ): Promise<Track[]> {
    return <Track[]>this.findElementsByCriterium(ENTITY.TRACKS, id, searchField);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    return <Track>this.updateElement(ENTITY.TRACKS, id, ENTITY_NAME.TRACK, updateTrackDto);
  }

  async remove(id: string): Promise<void> {
    const track = await this.findOne(id);

    if (await this.favoritesService.findOne(id, ENTITY.TRACKS, TRACK_FIELDS.ID)) {
      this.favoritesService.remove(ENTITY.TRACKS, id, ENTITY_NAME.TRACK);
    }

    this.removeElement(ENTITY.TRACKS, track);
  }
}
