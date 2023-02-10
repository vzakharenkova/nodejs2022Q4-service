import { Album } from '../../albums/entities/album.entity';
import { Artist } from '../../artists/entities/artist.entity';
import { Track } from '../../tracks/entities/track.entity';

export class Favorite {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
