import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import * as crypto from "crypto";


@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, "api-key") {
    constructor(private readonly configService: ConfigService) {
        super(
            { header: "x-api-key", prefix: "" },
            false,
        );
    }
    
    public validate = (apiKey: string): boolean => {
        const validApiKey = this.configService.getOrThrow<string>("security.apiKey");

        const bufferApiKey = Buffer.from(apiKey);
        const bufferValidKey = Buffer.from(validApiKey);
        if (bufferApiKey.length !== bufferValidKey.length) {
            throw new UnauthorizedException("Invalid API key");
        }

        const isValid = crypto.timingSafeEqual(bufferApiKey, bufferValidKey);
        if (!isValid) throw new UnauthorizedException("Invalid API key");

        return true;
    };
};