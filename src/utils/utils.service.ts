import { BadRequestException, Injectable } from '@nestjs/common';

import { validate as validateUUID } from 'uuid';

@Injectable()
export class UtilsService {
  validateId(id: string) {
    const isValidId = validateUUID(id);

    if (!isValidId) {
      throw new BadRequestException('User id is invalid (not uuid)');
    }
  }
}
