import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class User {
  readonly id: string; // uuid v4

  @IsNotEmpty()
  @IsString()
  readonly login: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNumber()
  version: number; // integer number, increments on update

  @IsNumber()
  readonly createdAt: number; // timestamp of creation

  @IsNumber()
  updatedAt: number; // timestamp of last update
}

export enum USER_FIELDS {
  ID = 'id',
  PASSWORD = 'password',
  VERSION = 'version',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}
