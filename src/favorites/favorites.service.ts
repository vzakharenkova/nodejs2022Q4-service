import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { Album } from 'src/albums/entities/album.entity';
import { ArtistsService } from 'src/artists/artists.service';
import { Artist } from 'src/artists/entities/artist.entity';
import { db } from 'src/database/db';
import { Track } from 'src/tracks/entities/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { UtilsService } from 'src/utils/utils.service';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService extends UtilsService {
  private readonly favorites: Favorite = db.favorites;

  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,

    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
  ) {
    super();
  }

  async addTrack(id: string) {
    const track = await this.tracksService.findOne(id, true);

    this.favorites.tracks.push(track);

    return this.favorites.tracks;
  }

  async addAlbum(id: string) {
    const album = await this.albumsService.findOne(id, true);

    this.favorites.albums.push(album);

    return this.favorites.albums;
  }

  async addArtist(id: string) {
    const artist = await this.artistsService.findOne(id, true);

    this.favorites.artists.push(artist);

    return this.favorites.artists;
  }

  async findOne(
    id: string,
    searchEntity: string,
    searchField: string,
  ): Promise<Track[] | Album[] | Artist[]> {
    this.validateId(id);

    return this.favorites[searchEntity].find(
      (el: Track | Album | Artist) => el[searchField] === id,
    );
  }

  async findAll(): Promise<Favorite> {
    return this.favorites;
  }

  async removeTrack(id: string) {
    this.validateId(id);

    const track = this.favorites.tracks.find((track) => track.id === id);

    if (!track) {
      this.throwNotFoundException('Track', id);
    }

    const index = this.favorites.tracks.indexOf(track);

    this.favorites.tracks.splice(index, 1);
  }

  async removeAlbum(id: string) {
    this.validateId(id);

    const album = this.favorites.albums.find((album) => album.id === id);

    if (!album) {
      this.throwNotFoundException('Album', id);
    }

    const index = this.favorites.albums.indexOf(album);

    this.favorites.albums.splice(index, 1);
  }

  async removeArtist(id: string) {
    this.validateId(id);

    const artist = this.favorites.artists.find((artist) => artist.id === id);

    if (!artist) {
      this.throwNotFoundException('Artist', id);
    }

    const index = this.favorites.artists.indexOf(artist);

    this.favorites.artists.splice(index, 1);
  }
}
