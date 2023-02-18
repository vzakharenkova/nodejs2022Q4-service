import { Exclude } from 'class-transformer';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from '../../albums/entities/album.entity';
import { Artist } from '../../artists/entities/artist.entity';
import { Track } from '../../tracks/entities/track.entity';

@Entity('favorities')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string; // uuid v4

  @ManyToMany(() => Artist, { onDelete: 'CASCADE', eager: true })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album, { onDelete: 'CASCADE', eager: true })
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track, { onDelete: 'CASCADE', eager: true })
  @JoinTable()
  tracks: Track[];
}
