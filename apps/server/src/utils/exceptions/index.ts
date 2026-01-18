import {
  ForbiddenException as HttpForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException as HttpUnauthorizedException,
} from '@nestjs/common';

export class UnexpectedException extends InternalServerErrorException {}

export class UnauthorizedException extends HttpUnauthorizedException {}

export class ForbiddenException extends HttpForbiddenException {}

export class CustomNotFoundException extends NotFoundException {
  constructor(entity: string, id: number) {
    const message = `${entity} with id ${id} not found`;
    super(message);
  }
}
