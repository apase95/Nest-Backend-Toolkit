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
import { databaseConfig, securityConfig, validate } from "src/common/config";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
            load: [databaseConfig, securityConfig],
            validate: validate,
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
    providers: [],
})
export class AppModule {}
