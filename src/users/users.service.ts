import { Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { db } from 'src/database/db';
import { UtilsService } from 'src/utils/utils.service';

import { v4 as uuidv4 } from 'uuid';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends UtilsService {
  private readonly users: User[] = db.users;

  async create(createUserDto: CreateUserDto): Promise<User> {
    const timestamp = new Date().getTime();
    const user: User = {
      id: uuidv4(),
      ...createUserDto,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.users.push(user);

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User> {
    this.validateId(id);

    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.oldPassword !== user.password) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = updateUserDto.newPassword;
    user.updatedAt = new Date().getTime();
    ++user.version;

    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    const index = this.users.indexOf(user);

    this.users.splice(index, 1);
  }
}
