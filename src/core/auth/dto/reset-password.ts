import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordPayload {
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  newPassword: string;
  
  @IsString()
  token:string
}
