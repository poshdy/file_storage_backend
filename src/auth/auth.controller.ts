import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('google/register')
  createAccountWithGoogle() {
    // return this.authService.createAccountWithGoogle();
  }
  // @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('local/register')
  async createAccount(@Body() data: CreateUserDto) {
    return await this.authService.createAccount(data);
  }
  // @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('local/login')
  logIn(@Body() data: UpdateUserDto) {
    return this.authService.logIn(data);
  }
  @Post('logout')
  logOut() {
    return this.authService.logOut();
  }
}
