import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types';
import { CreateUserDto } from 'src/core/user/dto/create-user.dto';
import { UserService } from 'src/core/user/user.service';
import { compare, hash } from 'bcrypt';
import { UpdateUserDto } from 'src/core/user/dto/update-user.dto';
import { ReturnedUserType } from 'src/types/user.types';
import { ChangePasswordPayload } from './dto/change-password';
import { nanoid } from 'nanoid';
import { EmailService } from 'src/common/emails/email.service';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly verificationService: VerificationService,
  ) {}
  async createAccount(userData: CreateUserDto): Promise<Tokens> {
    const isExist = await this.userService.getUser(userData.email, 'email');
    if (isExist) {
      throw new Error('This Email is already used');
    }
    const hash = await this.hashData(userData.password);
    const newUser = await this.userService.create({
      email: userData.email,
      hash,
      name: userData.name,
    });

    const { access_token, refresh_token } = await this.generateTokens(
      newUser.email,
      newUser.id,
    );
    await this.userService.updateRt(newUser.id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }
  async logIn(userData: UpdateUserDto): Promise<ReturnedUserType> {
    const user = await this.userService.getUser(userData?.email, 'email');
    console.log(user, 'user obkect from login');
    if (!user) throw new UnauthorizedException('Access Denied');
    const isPassMatch = await this.compareHash(userData.password, user.hash);
    if (!isPassMatch) throw new UnauthorizedException('Access Denied');
    const { access_token, refresh_token } = await this.generateTokens(
      user.email,
      user.id,
    );
    await this.updateRt(user.id, refresh_token);
    return {
      id: user.id,
      email: user.email,
      access_token,
      refresh_token,
    };
  }

  async changePassword(data: ChangePasswordPayload, email: string) {
    const user = await this.userService.getUser(email, 'email');
    if (!user) throw new UnauthorizedException();

    const isPassMatch = await this.compareHash(data.oldPassword, user.hash);
    if (!isPassMatch) throw new UnauthorizedException('Access Denied');

    const areTheySame = data.newPassword === data.confirmPassword;
    if (!areTheySame) throw new BadRequestException('password does not match');

    const newHashedPassword = await this.hashData(data.newPassword);

    await this.userService.updateHash(email, newHashedPassword);
  }

  async logOut(userId: string) {
    await this.userService.logOut(userId);
  }

  async refreshToken(rt: string, userId: string) {
    const user = await this.userService.getUser(userId, 'id');
    if (!user) throw new ForbiddenException('access denied1');
    const isRtMatch = await this.compareHash(rt, user.hashedRt);
    if (!isRtMatch) throw new ForbiddenException('access denied2');
    const { access_token, refresh_token } = await this.generateTokens(
      user.email,
      user.id,
    );
    await this.updateRt(user.id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async updateRt(userId: string, rt: string) {
    const refresh_token = await this.hashData(rt);
    return await this.userService.updateRt(userId, refresh_token);
  }
  async generateTokens(email: string, id: string): Promise<Tokens> {
    const user = {
      email,
      id,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(user, {
        expiresIn: 60 * 15,
        secret: process.env.ACCESS_TOKEN_SECRET,
      }),
      this.jwtService.signAsync(user, {
        expiresIn: 60 * 60 * 24 * 10,
        secret: process.env.REFRESH_TOKEN_SECRET,
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async forgetPassword(email: string) {
    const user = await this.userService.getUser(email, 'email');
    if (!user) throw new UnauthorizedException();

    const resetToken = nanoid(64);

    const date = new Date();
    const newDate = date.setMinutes(date.getMinutes() + 10);
    const expiresAt = new Date(newDate).toISOString();

    await this.userService.createResetToken(user.id, resetToken, expiresAt);
    await this.emailService.sendResetMail(user.email, resetToken);
  }
  async resetPassword(newPassword: string, resetToken: string) {
    const token = await this.userService.getResetToken(resetToken);
    if (!token) throw new UnauthorizedException('Invalid Token');

    const newHashedPassword = await this.hashData(newPassword);
    const user = await this.userService.getUser(token.userId, 'id');
    if (!user) throw new NotFoundException();

    await this.userService.updateHash(user.email, newHashedPassword);
  }
  async createAccountWithGoogle(email: string, name: string) {
    const isExist = await this.userService.getUser(email, 'email');
    if (isExist) {
      throw new Error('This Email is already used');
    }
    const newUser = await this.userService.create({
      email,
      name,
    });

    const { access_token, refresh_token } = await this.generateTokens(
      newUser.email,
      newUser.id,
    );
    console.log(refresh_token);
    await this.userService.updateRt(newUser.id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async verificationHandler(userId: string) {
    const user = await this.userService.getUser(userId, 'id');
    if (!user) {
      throw new NotFoundException();
    }
    if (user.verified) {
      throw new UnauthorizedException('Account is already Verified');
    }
    const otp = await this.verificationService.generateVerificationCode(
      user.id,
      6,
    );
    // await this.emailService.sendOtpMail(user.email, user.name, otp);
  }

  async verifyOtp(otp: string, userId: string) {
    const invalidMessage = 'Invalid or expired OTP';

    const user = await this.userService.getUser(userId, 'id');
    if (!user) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    if (user.verified) {
      throw new UnprocessableEntityException('Account already verified');
    }

    await this.verificationService.validateOtp(user.id, otp);

    await this.userService.updateAccountStatus(user.id);

    return true;
  }

  async hashData(data: string) {
    return await hash(data, 10);
  }

  async compareHash(data: string, hash: string) {
    return await compare(data, hash);
  }
}
