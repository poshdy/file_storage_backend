import { Injectable } from '@nestjs/common';
import { Tokens } from 'src/types';

@Injectable()
export class AuthService {
  createAccount() {
    return;
  }
  logIn() {
    return;
  }
  createAccountWithGoogle() {
    return;
  }
  logOut() {
    return;
  }

  hashData(data: string) {
    return;
  }

  compareHash(data: string) {
    return;
  }
  generateTokens(): Promise<Tokens> {
    return;
  }
}
