import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token';
import { RefreshTokenStrategy } from './strategies/refresh-token';
import { UserModule } from 'src/core/user/user.module';
import { GoogleStrategy } from './strategies/google';
import { EmailModule } from 'src/common/emails/email.module';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [JwtModule.register({}), UserModule, EmailModule,VerificationModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
