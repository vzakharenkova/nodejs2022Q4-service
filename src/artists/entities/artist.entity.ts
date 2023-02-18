import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from '../../albums/entities/album.entity';
import { Track } from '../../tracks/entities/track.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string; // uuid v4

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];
}

export enum ARTIST_FIELDS {
  ID = 'id',
  NAME = 'name',
  GRAMMY = 'grammy',
}
