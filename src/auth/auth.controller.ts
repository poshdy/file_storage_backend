import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { GetCurrentUser } from './decorators/get-current-user';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { Request } from 'express';
import { User } from 'src/types/user.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @UseGuards(GoogleAuthGuard)
  // @Get('google/register')
  // createAccountWithGoogle() {
  //   return { msg: 'ho' };
  // }

  // @Get('google/redirect')
  // @UseGuards(GoogleAuthGuard)
  // redirect() {
  //   return { message: 'donee' };
  // }

  @HttpCode(HttpStatus.CREATED)
  @Post('local/register')
  async createAccount(@Body() data: CreateUserDto) {
    return await this.authService.createAccount(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('local/login')
  logIn(@Body() data: UpdateUserDto) {
    return this.authService.logIn(data);
  }
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logOut(@GetCurrentUser('id') userId: string) {
    return this.authService.logOut(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshToken(@GetCurrentUser() user: any) {
   return this.authService.refreshToken(user.refresh_token,user.id)
    
  }
}
