import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';

import { db } from '../database/db';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { User, USER_FIELDS } from '../users/entities/user.entity';
import {
  ENTITY,
  ENTITY_NAME,
  UNION_ENTITIES,
  UNION_ENTITIES_LIST,
  UNION_UPDATE_DTO,
} from './utils.model';

@Injectable()
export class UtilsService {
  private readonly db = db;

  validateId(id: string): void {
    const isValidId = validateUUID(id);

    if (!isValidId) {
      throw new BadRequestException('User id is invalid (not uuid)');
    }
  }

  throwNotFoundException(entityName: string, id: string): void {
    throw new NotFoundException(`${entityName} with id ${id} is not found`);
  }

  throwUnprocessableEntityException(entityName: string, id: string): void {
    throw new UnprocessableEntityException(`${entityName} with id ${id} is not exist`);
  }

  async findAllElements(repository: Repository<UNION_ENTITIES>): Promise<UNION_ENTITIES_LIST> {
    return await repository.find();
  }

  async findElement(
    repository: Repository<UNION_ENTITIES>,
    id: string,
    name: ENTITY_NAME,
    isFavs?: boolean,
  ): Promise<UNION_ENTITIES> {
    this.validateId(id);

    const element = await repository.findOne({ where: { id } });

    if (!element) {
      isFavs
        ? this.throwUnprocessableEntityException(name, id)
        : this.throwNotFoundException(name, id);
    }

    return element;
  }

  findElementsByCriterium(
    entity: ENTITY,
    id: string,
    searchField: string,
    inFavs?: boolean,
  ): UNION_ENTITIES_LIST {
    this.validateId(id);

    const element_DB: UNION_ENTITIES_LIST = inFavs ? this.db.favorites[entity] : this.db[entity];

    return element_DB.filter((element) => element[searchField] === id);
  }

  async removeElement(
    repository: Repository<UNION_ENTITIES>,
    element: UNION_ENTITIES,
    fromFavs?: boolean,
  ): Promise<void> {
    // const element_DB: UNION_ENTITIES_LIST = fromFavs ? this.db.favorites[entity] : this.db[entity];

    await repository.remove(element);

    // const index = element_DB.indexOf(element);

    // element_DB.splice(index, 1);
  }

  async createElement(
    repository: Repository<UNION_ENTITIES>,
    element: UNION_ENTITIES,
  ): Promise<UNION_ENTITIES> {
    const createdElement = repository.create(element);

    // return <User>this.createElement(ENTITY.USERS, user);

    return await repository.save(createdElement);
  }

  async updateElement(
    repository: Repository<UNION_ENTITIES>,
    id: string,
    name: ENTITY_NAME,
    updateDto: UNION_UPDATE_DTO,
  ): Promise<UNION_ENTITIES> {
    const element = await this.findElement(repository, id, name);

    if (USER_FIELDS.PASSWORD in element) {
      if ((<UpdateUserDto>updateDto).oldPassword !== element.password) {
        throw new ForbiddenException('Old password is wrong');
      }

      element.password = (<UpdateUserDto>updateDto).newPassword;
      element.updatedAt = new Date().getTime();
      ++element.version;
    } else {
      const keys = Object.keys(updateDto);

      keys.forEach((key) => (element[key] = updateDto[key]));
    }

    return await repository.save(element);
  }
}
