import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class VerifyEmailDto {
    @ApiProperty({ example: "abc-123-xyz", description: "Verification token from email" })
    @IsString()
    @IsNotEmpty()
    token!: string;
};

