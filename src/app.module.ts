import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module"; 
import { SessionModule } from "./modules/session/session.module";
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from "src/modules/notification/notification.module";
import { HealthModule } from "src/modules/health/health.module";
import { DatabaseModule } from "src/common/database/database.module";
import { StorageModule } from "src/common/storage";
import { SecurityModule } from "src/common/security";
import { cloudinaryConfig, databaseConfig, securityConfig, validate } from "src/common/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
            load: [databaseConfig, securityConfig, cloudinaryConfig],
            validate: validate,
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ([
                {
                    ttl: config.get<number>("security.rateLimit.ttl") || 60000,
                    limit: config.get<number>("security.rateLimit.limit") || 10,
                }
            ]),
        }),
        
        DatabaseModule,
        SecurityModule,
        StorageModule,

        AuthModule,
        UserModule,
        SessionModule,
        NotificationModule,
        HealthModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
