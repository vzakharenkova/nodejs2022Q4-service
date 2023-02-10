import { UpdateAlbumDto } from '../albums/dto/update-album.dto';
import { Album } from '../albums/entities/album.entity';
import { UpdateArtistDto } from '../artists/dto/update-artist.dto';
import { Artist } from '../artists/entities/artist.entity';
import { UpdateTrackDto } from '../tracks/dto/update-track.dto';
import { Track } from '../tracks/entities/track.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { User } from '../users/entities/user.entity';

export enum ENTITY {
  ALBUMS = 'albums',
  ARTISTS = 'artists',
  TRACKS = 'tracks',
  USERS = 'users',
}

export enum ENTITY_NAME {
  ALBUM = 'Album',
  ARTIST = 'Artist',
  TRACK = 'Track',
  USER = 'User',
}

export type UNION_ENTITIES = Album | Artist | Track | User;

export type UNION_ENTITIES_LIST = UNION_ENTITIES[];

export type UNION_UPDATE_DTO = UpdateAlbumDto | UpdateArtistDto | UpdateTrackDto | UpdateUserDto;
