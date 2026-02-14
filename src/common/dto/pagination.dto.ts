import { Type } from "class-transformer";
import { IsInt, IsOptional, Min, IsString, IsIn } from "class-validator";


export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    @IsIn(["asc", "desc"])
    sortOrder?: "asc" | "desc" = "desc";

    @IsOptional()
    @IsString()
    sortBy?: string = "createdAt";

    get skip(): number {
        return ((this.page || 1) - 1) * (this.limit || 10);
    }
};
