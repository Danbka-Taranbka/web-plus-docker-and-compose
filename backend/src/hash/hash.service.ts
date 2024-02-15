import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
  
  async hash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
