import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class Artist {
  readonly id: string; // uuid v4

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
