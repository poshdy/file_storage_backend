import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/core/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/core/user/dto/update-user.dto';
import { AuthenticationGuard } from './guards/authentication.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ReturnedUserType, User } from 'src/types/user.types';
import { GoogleAuthGuard } from './guards/google.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user';
import { ChangePasswordPayload } from './dto/change-password';
import { ForgetPasswordPayload } from './dto/forget-password';
import { ResetPasswordPayload } from './dto/reset-password';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(GoogleAuthGuard)
  @Get('google/register')
  createAccountWithGoogle() {
    return { success: true };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  redirect() {
    return { success: true };
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('local/register')
  async createAccount(@Body() data: CreateUserDto) {
    return await this.authService.createAccount(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('local/login')
  async logIn(@Body() data: UpdateUserDto): Promise<ReturnedUserType> {
    const user = await this.authService.logIn(data);
    return user;
  }
  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logOut(@GetCurrentUser('id') userId: string) {
    return this.authService.logOut(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshToken(@GetCurrentUser() user: any) {
    return this.authService.refreshToken(user.refresh_token, user.id);
  }

  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('change-password')
  async changePassword(
    @GetCurrentUser() user: { email: string },
    @Body() data: ChangePasswordPayload,
  ) {
    await this.authService.changePassword(data, user.email);
    return {
      message: 'Password Changed Successfully',
    };
  }
  @HttpCode(HttpStatus.OK)
  @Post('forget-password')
  async forgetPassword(@Body() data: ForgetPasswordPayload) {
    await this.authService.forgetPassword(data.email);
    return {
      message: 'Email Sent!',
    };
  }
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordPayload) {
    await this.authService.resetPassword(data.newPassword, data.token);
    return {
      message: 'Password Updated!',
    };
  }

  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Post('otp')
  async generateAccountOtp(@GetCurrentUser() user: { id: string }) {
    await this.authService.verificationHandler(user.id);
    return {
      message: 'Sending an email',
    };
  }
  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Post('otp/verify')
  async verifyOpt(
    @Query('otp') otp: string,
    @GetCurrentUser() user: { id: string },
  ) {
    console.log(otp);
    await this.authService.verifyOtp(otp, user.id);
    return {
      message: 'Verified!',
    };
  }
}
