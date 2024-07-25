import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('google/register')
  createAccountWithGoogle() {
    return this.authService.createAccountWithGoogle();
  }
  @Post('local/register')
  createAccount() {
    return this.authService.createAccount();
  }
  @Post('local/login')
  logIn() {
    return this.authService.logIn();
  }
  @Post('logout')
  logOut() {
    return this.authService.logOut();
  }
}
