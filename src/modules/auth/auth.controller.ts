import {
    Controller,
    Post,
    Body,
    Req,
    Res,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { ConfigService } from "@nestjs/config";


@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    private getCookieOptions() {
        return {
            httpOnly: true,
            secure: this.configService.get("NODE_ENV") === "production",
            sameSite: "strict" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };
    };

    @Post("register")
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const data = await this.authService.register(registerDto);
        res.cookie("refreshToken", data.refreshToken, this.getCookieOptions());
        return { user: data.user, accessToken: data.accessToken };
    };

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const userAgent = req.headers["user-agent"] || "";
        const ipAddress = req.ip || "";
        const data = await this.authService.login(loginDto, userAgent, ipAddress);

        res.cookie("refreshToken", data.refreshToken, this.getCookieOptions());
        return { user: data.user, accessToken: data.accessToken };
    };

    @Post("refresh-token")
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const incomingRefreshToken = req.cookies["refreshToken"];
        if (!incomingRefreshToken) throw new UnauthorizedException("No Refresh Token provided");

        const userAgent = req.headers["user-agent"] || "";
        const ipAddress = req.ip || "";

        const data = await this.authService.refreshToken(
            incomingRefreshToken,
            userAgent,
            ipAddress,
        );

        res.cookie("refreshToken", data.refreshToken, this.getCookieOptions());
        return { accessToken: data.accessToken };
    };

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies["refreshToken"];
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }

        res.clearCookie("refreshToken", { ...this.getCookieOptions(), maxAge: 0 });
        return { message: "Logged out successfully" };
    };
}
