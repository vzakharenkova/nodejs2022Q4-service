import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';

import { IsNullOrString } from '../../utils/validators';

export class Album {
  readonly id: string; // uuid v4

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @Validate(IsNullOrString)
  artistId: string | null; // refers to Artist
}

export enum ALBUM_FIELDS {
  ID = 'id',
  NAME = 'name',
  YEAR = 'year',
  ARTIST_ID = 'artistId',
}
