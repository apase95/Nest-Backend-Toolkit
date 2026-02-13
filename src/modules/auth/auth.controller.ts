import { Controller, Post, Body, Req, Res, HttpCode, HttpStatus, UnauthorizedException, Get, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { RegisterDto, LoginDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto } from "./dto";


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

    @Post("verify-email")
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto.token);
    };

    @Post("forgot-password")
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    };

    @Post("reset-password")
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    };

    @Get("google")
    @UseGuards(AuthGuard("google"))
    async googleAuth() {};

    @Get("linkedin")
    @UseGuards(AuthGuard("linkedin"))
    async linkedinAuth() {};

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        const data = await this.authService.handleSocialLogin(req.user, "google");
        
        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: this.configService.get("NODE_ENV") === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const clientUrl = this.configService.get<string>('CLIENT_URL');
        return res.redirect(`${clientUrl}/oauth-success?token=${data.accessToken}`);
    };

    @Get("linkedin/callback")
    @UseGuards(AuthGuard("linkedin"))
    async linkedinAuthCallback(@Req() req: Request, @Res() res: Response) {
        const data = await this.authService.handleSocialLogin(req.user, "linkedin");
        
        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: this.configService.get("NODE_ENV") === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const clientUrl = this.configService.get<string>('CLIENT_URL');
        return res.redirect(`${clientUrl}/oauth-success?token=${data.accessToken}`);
    };
}
