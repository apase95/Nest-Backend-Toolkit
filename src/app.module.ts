import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./modules/auth/auth.module"; 
import { SessionModule } from "./modules/session/session.module";
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from "src/modules/notification/notification.module";
import { HealthModule } from "src/modules/health/health.module";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("MONGO_URI"),
            }),
            inject: [ConfigService],
        }),
        UserModule,
        AuthModule,
        SessionModule,
        NotificationModule,
        HealthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
