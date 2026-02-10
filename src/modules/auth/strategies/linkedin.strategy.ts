import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-linkedin-oauth2";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, "linkedin") {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.getOrThrow<string>("LINKEDIN_CLIENT_ID"),
            clientSecret: configService.getOrThrow<string>("LINKEDIN_CLIENT_SECRET"),
            callbackURL: configService.getOrThrow<string>("LINKEDIN_CALLBACK_URL"),
            scope: ["openid", "profile", "email"],
        });
    };

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
    ): Promise<any> {
        const { name, emails, photos, id } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            providerId: id,
            accessToken,
        };
        done(null, user);
    };
}
