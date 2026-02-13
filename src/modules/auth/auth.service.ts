import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model, Types } from "mongoose";
import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import { RegisterDto } from "src/modules/auth/dto/register.dto";
import { LoginDto } from "src/modules/auth/dto/login.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "src/modules/auth/dto/password.dto";
import { MailService } from "src/modules/mail/mail.service";
import { EmailVerification } from "src/modules/auth/schemas/email-verification.schema";
import { PasswordReset } from "src/modules/auth/schemas/password-reset.schema";
import { UserRole } from "src/modules/user/schemas/user.schema";
import { v4 as uuidv4 } from "uuid";


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private sessionService: SessionService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService,
        @InjectModel(EmailVerification.name)
        private emailVerificationModel: Model<EmailVerification>,
        @InjectModel(PasswordReset.name) private passwordResetModel: Model<PasswordReset>,
    ) {}

    async register(registerDto: RegisterDto) {
        const newUser = await this.userService.create(registerDto);
        await this.sendVerificationEmail(newUser);
        return this.generateAuthResponse(newUser);
    };

    async login(loginDto: LoginDto, userAgent: string, ipAddress: string) {
        const user = await this.userService.validateUserForAuth(loginDto.email);
        if (!user) throw new UnauthorizedException("Invalid credentials");
        if (user.isDeleted) throw new ForbiddenException("Account has been deleted");
        if (user.isLocked) throw new ForbiddenException("Account has been locked");

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) throw new UnauthorizedException("Invalid credentials");

        return this.generateAuthResponse(user, userAgent, ipAddress);
    };

    async handleSocialLogin(profile: any, provider: "google" | "linkedin") {
        let user = await this.userService.findByEmail(profile.email);

        if (user) {
            if (provider === "google" && !user.googleId) {
                user.googleId = profile.providerId;
                user.avatarUrl = user.avatarUrl || profile.picture;
                await user.save();
            } else if (provider === "linkedin" && !user.linkedinId) {
                user.linkedinId = profile.providerId;
                user.avatarUrl = user.avatarUrl || profile.picture;
                await user.save();
            }
        } else {
            const randomPassword = uuidv4();
            user = await this.userService.create({
                email: profile.email,
                displayName: `${profile.firstName} ${profile.lastName}`,
                password: randomPassword,
                role: UserRole.USER,
                isEmailVerified: true,
                googleId: provider === "google" ? profile.providerId : null,
                avatarURL: profile.picture,
            } as any);
        }

        return this.generateAuthResponse(user);
    };

    async refreshToken(inComingRefreshToken: string, userAgent: string, ipAddress: string) {
        let payload;
        try {
            payload = this.jwtService.verify(inComingRefreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
            });
        } catch (error) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        const { sub: userId, sessionId } = payload;

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
        } catch (e) {}
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

    private async generateAuthResponse(user: any, userAgent = "", ipAddress = "") {
        const sessionId = new Types.ObjectId();
        const tokens = await this.generateTokens(user, sessionId.toString());

        await this.sessionService.createSession(
            user._id,
            tokens.refreshToken,
            userAgent,
            ipAddress,
            sessionId,
        );
        return {
            user: {
                _id: user._id,
                email: user.email,
                displayName: user.displayName,
                role: user.role,
            },
            ...tokens,
        };
    };

    async sendVerificationEmail(user: any) {
        if (!user) throw new BadRequestException("User not found");
        
        const token = uuidv4();
        await this.emailVerificationModel.create({ userId: user._id, token });

        const clientUrl = this.configService.get<string>("CLIENT_URL");
        const link = `${clientUrl}/verify-email?token=${token}`;

        await this.mailService.sendEmail(
            user.email,
            "Verify Email",
            `<a href="${link}">Click here to verify</a>`,
        );
    };

    async verifyEmail(token: string) {
        const record = await this.emailVerificationModel.findOne({ token });
        if (!record) throw new BadRequestException("Invalid or expired token");

        const user = await this.userService.findById(record.userId.toString());
        if (user.isEmailVerified) throw new BadRequestException("Email already verified");

        user.isEmailVerified = true;
        
        await user.save();
        await this.emailVerificationModel.deleteOne({ _id: record._id });
        return { message: "Email verified successfully" };
    };

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) return;

        if (user.googleId || user.linkedinId) {
             throw new BadRequestException("Social accounts cannot reset password");
        }

        await this.passwordResetModel.deleteMany({ userId: user._id });

        const token = uuidv4();
        await this.passwordResetModel.create({ userId: user._id, token });

        const clientUrl = this.configService.get<string>('CLIENT_URL');
        const link = `${clientUrl}/reset-password?token=${token}`;

        await this.mailService.sendEmail(
            user.email,
            'Reset Password',
            `<a href="${link}">Click here to reset password</a>`
        );
        return { message: "If email exists, reset link sent." };
    };

    async resetPassword(dto: ResetPasswordDto) {
        const record = await this.passwordResetModel.findOne({ token: dto.token });
        if (!record) throw new BadRequestException("Invalid or expired token");

        const user = await this.userService.findById(record.userId.toString());
        user.password = dto.password;

        await user.save();
        await this.passwordResetModel.deleteOne({ _id: record._id });
        await this.sessionService.revokeAllSessions(user._id.toString());

        return { message: "Password reset successfully" };
    };
}
