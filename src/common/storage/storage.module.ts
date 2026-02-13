import { Module, Global } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryService } from "./cloudinary.service";


const CloudinaryProvider = {
    provide: "CLOUDINARY",
    useFactory: (configService: ConfigService) => {
        return cloudinary.config({
            cloud_name: configService.get<string>("CLOUDINARY_NAME"),
            api_key: configService.get<string>("CLOUDINARY_KEY"),
            api_secret: configService.get<string>("CLOUDINARY_SECRET"),
        });
    },
    inject: [ConfigService],
};

@Global()
@Module({
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryService],
})
export class StorageModule {}
