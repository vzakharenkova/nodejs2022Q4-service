import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class DecodedUserPayload {
  userId: string;
  login: string;
}
