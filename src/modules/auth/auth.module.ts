import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import type { JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose"; 
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { SessionModule } from "../session/session.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { StringValue } from "ms";
import { MailModule } from "src/modules/mail/mail.module";
import { EmailVerification, EmailVerificationSchema } from "src/modules/auth/schemas/email-verification.schema";
import { PasswordReset, PasswordResetSchema } from "src/modules/auth/schemas/password-reset.schema";
import { GoogleStrategy } from "src/modules/auth/strategies/google.strategy";
import { LinkedInStrategy } from "src/modules/auth/strategies/linkedin.strategy";


@Module({
    imports: [
        UserModule,
        SessionModule,
        PassportModule,
        MailModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): JwtModuleOptions => ({
                secret: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
                signOptions: {
                    expiresIn: configService.getOrThrow<StringValue>("JWT_ACCESS_EXPIRATION"),
                },
            }),
        }),
        MongooseModule.forFeature([
            { name: EmailVerification.name, schema: EmailVerificationSchema },
            { name: PasswordReset.name, schema: PasswordResetSchema },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, LinkedInStrategy],
    exports: [AuthService],
})
export class AuthModule {}
