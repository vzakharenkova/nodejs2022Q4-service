import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';

import { db } from '../database/db';
import { ENTITY, ENTITY_NAME } from '../utils/utils.model';
import { UtilsService } from '../utils/utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends UtilsService {
  private readonly users: User[] = db.users;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const timestamp = new Date().getTime();
    const user: User = {
      id: uuidv4(),
      ...createUserDto,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // const createdUser = this.usersRepository.create(user);

    return await (<Promise<User>>this.createElement(this.usersRepository, user));

    // return await this.usersRepository.save(createdUser);
  }

  async findAll(): Promise<User[]> {
    return await (<Promise<User[]>>this.findAllElements(this.usersRepository));
  }

  async findOne(id: string): Promise<User> {
    return await (<Promise<User>>this.findElement(this.usersRepository, id, ENTITY_NAME.USER));
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await (<Promise<User>>(
      this.updateElement(this.usersRepository, id, ENTITY_NAME.USER, updateUserDto)
    ));
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    return await this.removeElement(this.usersRepository, user);
  }
}
