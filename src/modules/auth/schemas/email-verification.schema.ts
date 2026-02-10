import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from "mongoose";
import { User } from 'src/modules/user/schemas/user.schema';


export type EmailVerificationDocument = HydratedDocument<EmailVerification>;

@Schema()
export class EmailVerification {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true, })
    userId!: Types.ObjectId;

    @Prop({ required: true })
    token!: string;

    @Prop({ type: Date, default: Date.now, expires: 86400 })
    createAt?: Date;
};  

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);