import { DBModel } from './db.model';

export const db: DBModel = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
  favorites: { artists: [], tracks: [], albums: [] },
};
