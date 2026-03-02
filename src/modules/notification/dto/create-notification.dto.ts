import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { NotificationType } from "src/modules/notification/schemas/notification.schema";


export class CreateNotificationDto {
    @ApiProperty({ example: "1000000007", description: "Target User ID" })
    @IsNotEmpty()
    userId!: Types.ObjectId | string;

    @ApiPropertyOptional({ enum: NotificationType, example: NotificationType.SYSTEM })
    @IsEnum(NotificationType)
    @IsOptional()
    type?: NotificationType;

    @ApiProperty({ example: "Welcome!", description: "Notification title" })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ example: "Thank you for registering.", description: "Notification content" })
    @IsString()
    @IsNotEmpty()
    message!: string;

    @ApiPropertyOptional({ example: { orderId: "123" }, description: "Additional metadata" })
    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;
};