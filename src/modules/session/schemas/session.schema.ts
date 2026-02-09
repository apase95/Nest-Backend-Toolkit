import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    refreshToken: string;

    @Prop()
    userAgent: string;

    @Prop()
    ip: string;

    @Prop({ type: Date, expires: '7d', default: Date.now })
    expiredAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);