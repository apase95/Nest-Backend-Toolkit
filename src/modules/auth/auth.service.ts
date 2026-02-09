import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { SessionService } from "src/modules/session/session.service";
import * as bcrypt from 'bcrypt';


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
        ip: string,
    ) {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new UnauthorizedException("Invalid credentials");
        }
        return this.generateAuthResponse(user, userAgent, ip);
    };

    async refreshToken(
        oldRefreshToken: string, 
        userAgent: string, 
        ip: string,
    ) {
        try {
            this.jwtService.verify(oldRefreshToken, {
                secret: this.configService.get("JWT_REFRESH_TOKEN"),
            });
        } catch (error) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        const session = await this.sessionService.findSessionByToken(oldRefreshToken);
        if (!session) throw new ForbiddenException("Session expired or revoked");

        const user = await this.userService.findById(session.userId.toString());
        const tokens = await this.generateToken(user);
        
        await this.sessionService.updateSessionToken(session._id, tokens.refreshToken);
        return tokens;
    };

    async logout(refreshToken) {
        await this.sessionService.deleteSession(refreshToken);
    };

    private async generateTokens(user: any) {
        const payload = { sub: user._id, role: user.role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
            }),
        ]);

        return { accessToken, refreshToken };
    };

    private async generateAuthResponse(
        user: any, 
        userAgent = '', 
        ip = ''
    ) {
        const tokens = await this.generateTokens(user);
        
        await this.sessionService.createSession(user._id, tokens.refreshToken, userAgent, ip);
        return {
            user: { id: user._id, email: user.email, role: user.role },
            ...tokens,
        };
    };
};