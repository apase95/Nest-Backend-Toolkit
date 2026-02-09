import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument  } from "mongoose";
import * as bcrypt from "bcrypt";


export type UserDocument = HydratedDocument<User>;

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
};


@Schema({ 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})export class User {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ select: false })
    password: string;

    @Prop({ required: true, trim: true })
    displayName: string;

    @Prop({ default: '' })
    firstName: string;

    @Prop({ default: '' })
    lastName: string;

    @Prop({ sparse: true })
    phoneNumber: string;

    @Prop()
    avatarURL: string;

    @Prop({ default: null, index: true })
    googleId: string;

    @Prop({ default: null, index: true })
    linkedinId: string;

    @Prop({ default: false })
    isEmailVerified: boolean;

    @Prop({ default: false })
    isLocked: boolean;

    @Prop({ default: false, select: false })
    isDeleted: boolean;

    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});