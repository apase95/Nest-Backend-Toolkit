import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { NotificationType } from "src/modules/notification/schemas/notification.schema";


export class CreateNotificationDto {
    @IsNotEmpty()
    userId!: Types.ObjectId | string;

    @IsEnum(NotificationType)
    @IsOptional()
    type?: NotificationType;

    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;
};