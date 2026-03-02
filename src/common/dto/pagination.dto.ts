import { Type } from "class-transformer";
import { IsInt, IsOptional, Min, IsString, IsIn } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";


export class PaginationDto {
    @ApiPropertyOptional({ example: 1, description: "Page number" })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, description: "Items per page" })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ example: "Duy", description: "Search keyword" })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: ["asc", "desc"], example: "desc" })
    @IsOptional()
    @IsString()
    @IsIn(["asc", "desc"])
    sortOrder?: "asc" | "desc" = "desc";

    @ApiPropertyOptional({ example: "createdAt", description: "Sort by field" })
    @IsOptional()
    @IsString()
    sortBy?: string = "createdAt";

    get skip(): number {
        return ((this.page || 1) - 1) * (this.limit || 10);
    }
}
