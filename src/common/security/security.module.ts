import { Module, Global } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";
import { HashService } from "./hash.service";
import { ApiKeyStrategy } from "./api-key.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";
import { ApiKeyGuard, JwtAuthGuard } from "src/common/security/guards";


@Global()
@Module({
    imports: [PassportModule, ConfigModule],
    providers: [
        HashService, 

        ApiKeyStrategy, 
        JwtStrategy, 
        JwtRefreshStrategy,

        ApiKeyGuard,
        JwtAuthGuard,
    ],
    exports: [
        HashService, 
        ApiKeyStrategy, 
        JwtStrategy, 
        JwtRefreshStrategy,
        ApiKeyGuard,
        JwtAuthGuard,
    ],
})
export class SecurityModule {}
