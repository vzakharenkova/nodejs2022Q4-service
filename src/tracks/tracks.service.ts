import { Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { UtilsService } from 'src/utils/utils.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService extends UtilsService {
  private readonly tracks: Track[] = [];

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };

    this.tracks.push(track);

    return track;
  }

  async findAll(): Promise<Track[]> {
    return this.tracks;
  }

  async findOne(id: string): Promise<Track> {
    this.validateId(id);

    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      this.throwNotFoundException('Track', id);
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOne(id);

    const keys = Object.keys(updateTrackDto);

    keys.forEach((key) => (track[key] = updateTrackDto[key]));

    return track;
  }

  async remove(id: string): Promise<void> {
    const track = await this.findOne(id);

    const index = this.tracks.indexOf(track);

    this.tracks.splice(index, 1);
  }
}
