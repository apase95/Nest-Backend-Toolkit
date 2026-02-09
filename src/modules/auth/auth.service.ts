import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { Types } from "mongoose";

import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private sessionService: SessionService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ){}

    async register(registerDto: RegisterDto) {
        const newUser = await this.userService.create(registerDto);
        return this.generateAuthResponse(newUser);
    };

    async login(
        loginDto: LoginDto,
        userAgent: string, 
        ipAddress: string,
    ) {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        if (user.isDeleted) throw new ForbiddenException('Account has been deleted');
        if (user.isLocked) throw new ForbiddenException('Account has been locked');

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        return this.generateAuthResponse(user, userAgent, ipAddress);
    };

    async refreshToken(
        inComingRefreshToken: string, 
        userAgent: string, 
        ipAddress: string,
    ) {
        let payload;
        try {
            payload = this.jwtService.verify(inComingRefreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
            });
        } catch (error) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        const { userId, sessionId } = payload;

        const session = await this.sessionService.findSessionById(sessionId);
        if (!session) throw new ForbiddenException("Refresh token has been revoked or invalid");
        if (session.refreshToken !== inComingRefreshToken) {
            await this.sessionService.revokeAllSessions(userId);
            console.warn(`Token reuse detected for user ${userId}. All sessions revoked`);
            throw new ForbiddenException("Token reuse detected. Please login again");
        }

        const user = await this.userService.findById(session.userId.toString());
        const tokens = await this.generateTokens(user, session._id.toString());
        
        await this.sessionService.updateSessionToken(session._id, tokens.refreshToken);
        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    };

    async logout(refreshToken: string) {
        if (!refreshToken) return;
        try {
            await this.sessionService.deleteSession(refreshToken);
        } catch (e) {
        }
    };

    private async generateTokens(user: any, sessionId: string) {
        const payload = { sub: user._id, role: user.role, sessionId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get("JWT_ACCESS_SECRET"),
                expiresIn: this.configService.get("JWT_ACCESS_EXPIRATION"),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get("JWT_REFRESH_SECRET"),
                expiresIn: this.configService.get("JWT_REFRESH_EXPIRATION"),
            }),
        ]);

        return { accessToken, refreshToken };
    };

    private async generateAuthResponse(
        user: any, 
        userAgent = "", 
        ipAddress = ""
    ) {
        const sessionId = new Types.ObjectId();
        const tokens = await this.generateTokens(user, sessionId.toString());
        
        await this.sessionService.createSession(
            user._id, 
            tokens.refreshToken, 
            userAgent, 
            ipAddress
        );
        return {
            user: {
                _id: user._id,
                email: user.email,
                displayName: user.displayName,
                role: user.role
            },
            ...tokens,
        };
    };
};