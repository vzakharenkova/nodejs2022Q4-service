import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ENTITY_NAME } from '../utils/utils.model';
import { UtilsService } from '../utils/utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends UtilsService {
  private saltRounds: number;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super();

    this.saltRounds = +process.env.CRYPT_SALT || 10;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const timestamp = new Date().getTime();
    const user: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: await bcrypt.hash(createUserDto.password, this.saltRounds),
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return await (<Promise<User>>this.createElement(this.usersRepository, user));
  }

  async findAll(): Promise<User[]> {
    return await (<Promise<User[]>>this.findAllElements(this.usersRepository));
  }

  async findOne(id: string): Promise<User> {
    return await (<Promise<User>>this.findElement(this.usersRepository, id, ENTITY_NAME.USER));
  }

  async findByCriterium(criterium: string, value: string) {
    return await (<Promise<User[]>>this.usersRepository.find({ where: { [criterium]: value } }));
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = <User>await this.findElement(this.usersRepository, id, ENTITY_NAME.USER);

    if (!(await bcrypt.compare(updateUserDto.oldPassword, user.password))) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = await bcrypt.hash(updateUserDto.newPassword, this.saltRounds);
    user.updatedAt = new Date().getTime();
    ++user.version;

    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    return await this.removeElement(this.usersRepository, user);
  }
}
