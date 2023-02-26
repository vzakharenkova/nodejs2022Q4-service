import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateRefreshTokenDto, DecodedUserPayload } from './dto/auth-dto';

@Injectable()
export class AuthService {
  constructor(readonly usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async login(userData: CreateUserDto) {
    const users = await this.usersService.findByCriterium('login', userData.login);

    if (!users || !users.length) throw new ForbiddenException('no user with such login');

    if (!(await bcrypt.compare(userData.password, users[0].password))) {
      throw new ForbiddenException('wrong password');
    }

    return this.generateToken(users[0]);
  }

  async refresh(createRefreshTokenDto: CreateRefreshTokenDto) {
    const decodedUserData = <DecodedUserPayload>(
      jwt.verify(createRefreshTokenDto.refreshToken, process.env.JWT_SECRET_REFRESH_KEY)
    );

    const users = await this.usersService.findByCriterium('userId', decodedUserData.userId);

    if (!users || !users.length)
      throw new ForbiddenException('Refresh token is invalid or expired');

    return this.generateToken(users[0]);
  }

  generateToken(user: User) {
    const payload = { userId: user.id, login: user.login };

    return {
      accessToken: jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: jwt.sign(payload, process.env.JWT_SECRET_REFRESH_KEY, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }
}
