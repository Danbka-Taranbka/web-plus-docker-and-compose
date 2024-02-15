import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User with this name or email already exists!', HttpStatus.BAD_REQUEST);
  }
}