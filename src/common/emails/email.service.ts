import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport, SendMailOptions } from 'nodemailer';
@Injectable()
export class EmailService {
  private transporter = createTransport({
    host: this.configService.getOrThrow('MAIL_HOST'),
    port: this.configService.getOrThrow('MAIL_PORT'),
    auth: {
      user: this.configService.getOrThrow('MAIL_USER'),
      pass: this.configService.getOrThrow('MAIL_PASS'),
    },
  });
  constructor(private readonly configService: ConfigService) {}

  async sendResetMail(to: string, token: string) {
    const resetLink = `http://alihamed/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Quicksave authentication team',
      to,
      subject: 'Reset Password Email',
      html: `<p>You Requested Password Reset.. Click the link below to reset you password </p> <p><a href=${resetLink}>Reset Password</a></p>`,
    } satisfies SendMailOptions;

    await this.transporter.sendMail(mailOptions);
  }
}
