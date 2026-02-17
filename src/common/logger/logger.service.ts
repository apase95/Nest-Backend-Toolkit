import { Injectable, LoggerService, Scope } from "@nestjs/common";
import { createLogger, format, transports, Logger as WinstonLogger } from "winston";
import { ConfigService } from "@nestjs/config";

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
    private logger: WinstonLogger;

    constructor(private configService: ConfigService) {
        const isProduction = this.configService.get("NODE_ENV") === "production";
        const prodFormat = format.combine(format.timestamp(), format.json());
        const devFormat = format.combine(
            format.colorize(),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.printf(({ timestamp, level, message, context, requestId, ...meta }) => {
                const reqId = requestId ? `[${requestId}]` : "";
                const ctx = context ? `[${context}]` : "";
                const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
                return `${timestamp} ${level} ${reqId}${ctx}: ${message} ${metaStr}`;
            }),
        );

        this.logger = createLogger({
            level: isProduction ? "info" : "debug",
            format: isProduction ? prodFormat : devFormat,
            transports: [
                new transports.Console(),
            ],
        });
    }
    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, { trace, context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context });
    }

    custom(level: string, message: string, meta?: Record<string, any>) {
        this.logger.log(level, message, meta);
    }
};
