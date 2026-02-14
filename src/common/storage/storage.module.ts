import { Module, Global } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryService } from "./cloudinary.service";


const CloudinaryProvider = {
    provide: "CLOUDINARY",
    useFactory: (configService: ConfigService) => {
        return cloudinary.config({
            cloud_name: configService.getOrThrow<string>("cloudinary.cloud_name"),
            api_key: configService.getOrThrow<string>("cloudinary.api_key"),
            api_secret: configService.getOrThrow<string>("cloudinary.api_secret"),
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
