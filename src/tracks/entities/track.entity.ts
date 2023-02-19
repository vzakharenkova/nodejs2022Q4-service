import { IsNotEmpty, IsString, IsNumber, Validate } from 'class-validator';

import { IsNullOrString } from 'src/utils/validators';

export class Track {
  readonly id: string; // uuid v4

  @IsNotEmpty()
  @IsString()
  name: string;

  @Validate(IsNullOrString)
  artistId: string | null; // refers to Artist

  @Validate(IsNullOrString)
  albumId: string | null; // refers to Album

  @IsNumber()
  duration: number; // integer number
}

export enum TRACK_FIELDS {
  ID = 'id',
  NAME = 'name',
  ALBUM_ID = 'albumId',
  ARTIST_ID = 'artistId',
  DURATION = 'duration',
}
