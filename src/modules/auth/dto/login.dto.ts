import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class LoginDto {
    @ApiProperty({ example: "user@example.com", description: "User email" })
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ example: "password123", description: "User password (min 6 chars)" })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: "Password is required" })
    password!: string;
}
