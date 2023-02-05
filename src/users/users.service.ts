import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { db } from 'src/database/db';
import { ENTITY, ENTITY_NAME } from 'src/utils/utils.model';
import { UtilsService } from 'src/utils/utils.service';
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

    return <User>this.createElement(ENTITY.USERS, user);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User> {
    return <User>this.findElement(ENTITY.USERS, id, 'id', ENTITY_NAME.USER);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return <User>this.updateElement(ENTITY.USERS, id, ENTITY_NAME.USER, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    return this.removeElement(ENTITY.USERS, user);
  }
}
