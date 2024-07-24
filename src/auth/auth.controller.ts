import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Post('google/register')
  createAccountWithGoogle() {}
  @Post('register')
  createAccount() {}
  @Post('login')
  logIn() {}
}
