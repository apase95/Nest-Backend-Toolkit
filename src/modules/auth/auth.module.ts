import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import type { JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { SessionModule } from "../session/session.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { StringValue } from "ms";


@Module({
    imports: [
        UserModule,
        SessionModule,
        PassportModule,
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
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}