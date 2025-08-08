import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class UnexpectedException extends InternalServerErrorException {}

export class CustomNotFoundException extends NotFoundException {
  constructor(entity: string, id: number) {
    const message = `${entity} with id ${id} not found`;
    super(message);
  }
}
