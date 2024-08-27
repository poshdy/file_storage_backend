import { IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class ChangePasswordPayload {
    @IsString()
    oldPassword: string

    @IsString()
    @MinLength(6)
    @MaxLength(12)
    newPassword: string

    @IsString()
    @MinLength(6)
    @MaxLength(12)
    confirmPassword: string
}