import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateUserDto {
    @ApiProperty({ example: "user@example.com" })
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ example: "Ho Dang Thai Duy" })
    @IsString()
    @IsNotEmpty()
    displayName!: string;

    @ApiProperty({ example: "secretPass", minLength: 6 })
    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters" })
    password!: string;
}
