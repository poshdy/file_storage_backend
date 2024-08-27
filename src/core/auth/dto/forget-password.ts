import { IsEmail, IsString } from 'class-validator';

export class ForgetPasswordPayload {
  @IsEmail()
  email: string;
}
