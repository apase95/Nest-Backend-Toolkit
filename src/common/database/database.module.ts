import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { getMongooseConfig } from "src/common/database/mongo.connection";


@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: getMongooseConfig
        }),
    ],
    exports: [MongooseModule]
})
export class DatabaseModule {}