import { IsBooleanString, IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";
import { NotificationType } from "src/modules/notification/schemas/notification.schema";
import { ApiPropertyOptional } from "@nestjs/swagger";


export class ListNotificationDto {
    @ApiPropertyOptional({ example: 1, description: "Page number" })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, description: "Items per page" })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ example: "false", description: "Filter by read status (true/false)" })
    @IsOptional()
    @IsBooleanString()
    isRead?: string;

    @ApiPropertyOptional({ enum: NotificationType, description: "Filter by type" })
    @IsOptional()
    @IsEnum(NotificationType)
    type?: NotificationType;
};