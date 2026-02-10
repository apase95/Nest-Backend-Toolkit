import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "src/modules/user/schemas/user.schema";


export type PasswordResetDocument = HydratedDocument<PasswordReset>;

@Schema()
export class PasswordReset {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId!: Types.ObjectId;

    @Prop({ required: true })
    token!: string;
    
    @Prop({ type: Date, default: Date.now, expires: 3600 })
    createdAt?: Date;
};

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);