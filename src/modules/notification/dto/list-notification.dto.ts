import { IsBooleanString, IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";
import { NotificationType } from "src/modules/notification/schemas/notification.schema";


export class ListNotificationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsBooleanString()
    isRead?: string;

    @IsOptional()
    @IsEnum(NotificationType)
    type?: NotificationType;
};