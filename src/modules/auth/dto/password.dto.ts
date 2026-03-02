import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class ForgotPasswordDto {
    @ApiProperty({ example: "user@example.com", description: "Email to receive reset link" })
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty()
    email!: string;
};

export class ResetPasswordDto {
    @ApiProperty({ example: "token-from-email", description: "Reset password token" })
    @IsString()
    @IsNotEmpty()
    token!: string;

    @ApiProperty({ example: "newSecurePass123", description: "New password", minLength: 6 })
    @IsString()
    @MinLength(6)
    password!: string;
};