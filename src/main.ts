import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { CustomExceptionFilter } from "./common/exceptions";
import { AppValidationPipe } from "src/common/pipes";
import { LoggingInterceptor, RequestIdInterceptor, TimeoutInterceptor, TransformInterceptor } from "./common/interceptors";
import { AppLogger } from "./common/logger";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import hpp from "hpp";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    const configService = app.get(ConfigService);

    const logger = app.get(AppLogger);
    app.useLogger(logger);

    // app.use(helmet());

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "cdn.jsdelivr.net"],
                },
            },
        }),
    );

    app.use(hpp());

    app.use(cookieParser());

    app.useGlobalPipes(new AppValidationPipe());

    app.useGlobalFilters(new CustomExceptionFilter());

    app.useGlobalInterceptors(
        new RequestIdInterceptor(),
        new LoggingInterceptor(logger),
        new TimeoutInterceptor(),
        new TransformInterceptor(),
    );

    app.enableCors(configService.get("security.cors"));

    if (configService.get("NODE_ENV") !== "production") {
        const config = new DocumentBuilder()
            .setTitle("NestJS Backend Toolkit API")
            .setDescription("Documentation for NestJS Backend Toolkit")
            .setVersion("1.0")
            .addBearerAuth(
                {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
                "access-token",
            )
            .addApiKey(
                {
                    type: "apiKey",
                    name: "x-api-key",
                    in: "header",
                },
                "api-key",
            )
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("api/docs", app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }

    const port = configService.get<number>("PORT") || 3000;
    await app.listen(port);
    // logger.log(`Application is running on: ${await app.getUrl()}`, "Bootstrap");

    const appUrl = await app.getUrl();
    logger.log(`Application is running on: ${appUrl}`, "Bootstrap");
    if (configService.get("NODE_ENV") !== "production") {
        logger.log(`Swagger is running on: ${appUrl}/api/docs`, "Bootstrap");
    }
}
bootstrap();
