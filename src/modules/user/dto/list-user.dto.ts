import { IsOptional, IsString } from "class-validator";


export class UserQueryDto {
    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;
};