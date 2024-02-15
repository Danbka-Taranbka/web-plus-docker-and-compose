import { HttpException, HttpStatus } from '@nestjs/common';

export class WishAlreadyExistsException extends HttpException {
  constructor() {
    super('You have already copied this wish!', HttpStatus.BAD_REQUEST);
  }
}