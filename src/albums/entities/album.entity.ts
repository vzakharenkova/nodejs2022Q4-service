import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';
import { ManyToOne, OneToMany, JoinColumn, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Artist } from '../../artists/entities/artist.entity';
import { Track } from '../../tracks/entities/track.entity';

import { IsNullOrString } from '../../utils/validators';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string; // uuid v4

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @Column({ nullable: true })
  @Validate(IsNullOrString)
  artistId: string | null; // refers to Artist

  //   @ManyToOne(() => Artist, (artist) => artist.albums)
  //   @JoinColumn({ name: 'artistId' })
  //   artist: Artist;

  //   @OneToMany(() => Track, (track) => track.album)
  //   tracks: Track[];
}

export enum ALBUM_FIELDS {
  ID = 'id',
  NAME = 'name',
  YEAR = 'year',
  ARTIST_ID = 'artistId',
}
