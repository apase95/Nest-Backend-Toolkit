import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginDto {
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: "Password is required" })
    password!: string;
};