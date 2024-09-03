import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VerificationService {
  private readonly minRequestIntervalMinutes = 1;
  private readonly tokenExpirationMinutes = 15;
  private readonly saltRounds = 10;
  constructor(private readonly databaseService: DatabaseService) {}

  async generateOtp(size: number = 6) {
    const max = Math.pow(10, size);
    const randomNumber = crypto.randomInt(0, max);
    return randomNumber.toString().padStart(size, '0');
  }

  async generateVerificationCode(userId: string, size: number) {
    const date = new Date();
    const newDate = date.setMinutes(date.getMinutes() + 10);
    const expiresAt = new Date(newDate).toISOString();
    const recentOtp = await this.databaseService.oTPVerification.findFirst({
      where: {
        userId,
        createdAt: {
          gt: new Date(
            date.getTime() - this.minRequestIntervalMinutes * 60 * 1000,
          ),
        },
      },
    });
    if (recentOtp) {
      throw new UnprocessableEntityException(
        'Please wait a minute before requesting a new token.',
      );
    }

    const otp = await this.generateOtp(6);
    const hashedToken = await bcrypt.hash(otp, this.saltRounds);

    await this.databaseService.oTPVerification.create({
      data: {
        userId,
        otp: hashedToken,
        expiresAt,
      },
    });
    return otp;
  }

  async validateOtp(userId: string, token: string) {
    const invalidMessage = 'Invalid or expired OTP';
    const validToken = await this.databaseService.oTPVerification.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    console.log(validToken);

    if (!validToken) {
      throw new NotFoundException();
    }
    const isTheSame = await bcrypt.compare(token, validToken.otp);

    if (!isTheSame) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    await this.databaseService.oTPVerification.delete({
      where: {
        id: validToken.id,
      },
    });
  }
}
