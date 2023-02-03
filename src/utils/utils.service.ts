import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { validate as validateUUID } from 'uuid';

@Injectable()
export class UtilsService {
  validateId(id: string) {
    const isValidId = validateUUID(id);

    if (!isValidId) {
      throw new BadRequestException('User id is invalid (not uuid)');
    }
  }

  throwNotFoundException(entityName: string, id: string) {
    throw new NotFoundException(`${entityName} with id ${id} is not found`);
  }

  throwUnprocessableEntityException(entityName: string, id: string) {
    throw new UnprocessableEntityException(`${entityName} with id ${id} is not exist`);
  }
}
