import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string; // uuid v4

  @Column()
  @IsNotEmpty()
  @IsString()
  readonly login: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column()
  @IsNumber()
  version: number; // integer number, increments on update

  @Column({ type: 'bigint' })
  @IsNumber()
  readonly createdAt: number; // timestamp of creation

  @Column({ type: 'bigint' })
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
