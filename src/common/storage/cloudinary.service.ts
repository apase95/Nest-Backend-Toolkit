import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";


@Injectable()
export class CloudinaryService {
    uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        if (!file || !file.mimetype.startsWith("image/")) {
            throw new BadRequestException("Invalid file type. Only images are allowed.");
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "nestjs-toolkit-uploads",
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result!);
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    };

    async deleteImage(publicId: string): Promise<any> {
        return cloudinary.uploader.destroy(publicId);
    };
};