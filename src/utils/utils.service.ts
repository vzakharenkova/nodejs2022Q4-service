import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';

import { UpdateUserDto } from '../users/dto/update-user.dto';
import { USER_FIELDS } from '../users/entities/user.entity';
import { ENTITY_NAME, UNION_ENTITIES, UNION_ENTITIES_LIST, UNION_UPDATE_DTO } from './utils.model';

@Injectable()
export class UtilsService {
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

  async removeElement(
    repository: Repository<UNION_ENTITIES>,
    element: UNION_ENTITIES,
  ): Promise<void> {
    await repository.remove(element);
  }

  async createElement(
    repository: Repository<UNION_ENTITIES>,
    element: UNION_ENTITIES,
  ): Promise<UNION_ENTITIES> {
    const createdElement = repository.create(element);

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
