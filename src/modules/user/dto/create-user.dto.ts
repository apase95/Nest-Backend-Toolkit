import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class CreateUserDto {
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    displayName!: string;

    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters" })
    password!: string;
}
