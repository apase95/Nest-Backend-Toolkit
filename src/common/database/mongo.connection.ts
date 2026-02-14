import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";


export const getMongooseConfig = async (
    configService: ConfigService
): Promise<MongooseModuleOptions> => {
    const databaseConfig = configService.get("database")

    return {
        uri: databaseConfig.uri,
        // ...databaseConfig.options,
    };
};