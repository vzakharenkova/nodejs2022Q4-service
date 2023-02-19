import { IsNotEmpty, IsString, IsNumber, Validate } from 'class-validator';
import { ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Album } from '../../albums/entities/album.entity';
import { Artist } from '../../artists/entities/artist.entity';

import { IsNullOrString } from '../../utils/validators';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string; // uuid v4

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Validate(IsNullOrString)
  artistId: string | null; // refers to Artist

  @Column({ nullable: true })
  @Validate(IsNullOrString)
  albumId: string | null; // refers to Album

  @Column()
  @IsNumber()
  duration: number; // integer number

  @ManyToOne(() => Artist, (artist) => artist.tracks, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToOne(() => Album, (album) => album.tracks, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'albumId' })
  album: Album;
}

export enum TRACK_FIELDS {
  ID = 'id',
  NAME = 'name',
  ALBUM_ID = 'albumId',
  ARTIST_ID = 'artistId',
  DURATION = 'duration',
}
