import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as validateUUID } from 'uuid';

import { db } from 'src/database/db';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User, USER_FIELDS } from 'src/users/entities/user.entity';
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

  findElement(
    entity: ENTITY,
    id: string,
    searchField: string,
    name: ENTITY_NAME,
    isFavs?: boolean,
  ): UNION_ENTITIES {
    this.validateId(id);

    const element = (<UNION_ENTITIES_LIST>this.db[entity]).find(
      (element) => element[searchField] === id,
    );

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

  removeElement(entity: ENTITY, element: UNION_ENTITIES, fromFavs?: boolean): void {
    const element_DB: UNION_ENTITIES_LIST = fromFavs ? this.db.favorites[entity] : this.db[entity];

    const index = element_DB.indexOf(element);

    element_DB.splice(index, 1);
  }

  createElement(entity: ENTITY, element: UNION_ENTITIES): UNION_ENTITIES {
    (<UNION_ENTITIES_LIST>this.db[entity]).push(element);

    return element;
  }

  updateElement(
    entity: ENTITY,
    id: string,
    name: ENTITY_NAME,
    updateDto: UNION_UPDATE_DTO,
  ): UNION_ENTITIES {
    const element = this.findElement(entity, id, 'id', name);

    if (USER_FIELDS.PASSWORD in element) {
      if ((<UpdateUserDto>updateDto).oldPassword !== element.password) {
        throw new ForbiddenException(`${element instanceof User}`);
      }

      element.password = (<UpdateUserDto>updateDto).newPassword;
      element.updatedAt = new Date().getTime();
      ++element.version;
    } else {
      const keys = Object.keys(updateDto);

      keys.forEach((key) => (element[key] = updateDto[key]));
    }

    return element;
  }
}
