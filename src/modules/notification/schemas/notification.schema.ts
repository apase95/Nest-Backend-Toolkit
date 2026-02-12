import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "src/modules/user/schemas/user.schema";


export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
    SYSTEM = "SYSTEM",
    ORDER = "ORDER",
    PROMOTION = "PROMOTION",
    ACCOUNT = "ACCOUNT",
};


@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    userId!: Types.ObjectId;

    @Prop({ type: String, enum: NotificationType, default: NotificationType.SYSTEM })
    type!: NotificationType;

    @Prop({ required: true })
    message!: string;

    @Prop({ required: true })
    title!: string;

    @Prop({ default: false })
    isRead!: boolean;

    @Prop({ type: Object })
    metadata?: Record<string, any>;
};

export const NotificationSchema = SchemaFactory.createForClass(Notification);