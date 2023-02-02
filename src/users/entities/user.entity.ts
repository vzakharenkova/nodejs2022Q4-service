export class User {
  readonly id: string; // uuid v4
  readonly login: string;
  password: string;
  version: number; // integer number, increments on update
  readonly createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
