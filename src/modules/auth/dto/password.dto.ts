import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ForgotPasswordDto {
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty()
    email!: string;
};

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    token!: string;

    @IsString()
    @MinLength(6)
    password!: string;
};