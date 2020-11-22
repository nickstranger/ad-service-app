import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  private readonly saltRounds = 10;

  async hashPassword(plaintextPassword: string): Promise<string> {
    return await bcrypt.hash(plaintextPassword, this.saltRounds);
  }

  async checkPassword(plaintextPassword: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plaintextPassword, hash);
  }
}
