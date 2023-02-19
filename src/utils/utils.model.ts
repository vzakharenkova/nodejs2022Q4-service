import { UpdateAlbumDto } from 'src/albums/dto/update-album.dto';
import { Album } from 'src/albums/entities/album.entity';
import { UpdateArtistDto } from 'src/artists/dto/update-artist.dto';
import { Artist } from 'src/artists/entities/artist.entity';
import { UpdateTrackDto } from 'src/tracks/dto/update-track.dto';
import { Track } from 'src/tracks/entities/track.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';

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
