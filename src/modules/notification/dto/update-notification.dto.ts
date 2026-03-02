import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum, IsObject } from "class-validator";
import { NotificationType } from "src/modules/notification/schemas/notification.schema";


export class UpdateNotificationDto {
    @ApiPropertyOptional({ example: "New Title" })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: "New message content" })
    @IsOptional()
    @IsString()
    message?: string;

    @ApiPropertyOptional({ enum: NotificationType })
    @IsOptional()
    @IsEnum(NotificationType)
    type?: NotificationType;

    @ApiPropertyOptional({ example: { orderId: "123" }, description: "Additional metadata" })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
};