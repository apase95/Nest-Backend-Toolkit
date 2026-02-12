import { IsOptional, IsString, IsEnum, IsObject } from "class-validator";
import { NotificationType } from "src/modules/notification/schemas/notification.schema";


export class UpdateNotificationDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsEnum(NotificationType)
    type?: NotificationType;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
};