import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "../../user/dto/create-user.dto";


export class RegisterDto extends CreateUserDto {}

export class LoginDto {
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: "Password is required" })
    password!: string;
}