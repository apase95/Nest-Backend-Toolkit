import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument  } from "mongoose";
import * as bcrypt from "bcrypt";


export type UserDocument = HydratedDocument<User>;

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
};


@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    displayName: string;

    @Prop({ select: false })
    password: string;

    @Prop({ default: UserRole.USER })
    role: string;

    @Prop({ default: false })
    isEmailVerified: boolean;
};
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export { UserSchema };

