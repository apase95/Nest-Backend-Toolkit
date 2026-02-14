import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";


export const getMongooseConfig = async (
    configService: ConfigService    
): Promise<MongooseModuleOptions> => {
    return { uri: configService.get<string>("database.uri") };
};
