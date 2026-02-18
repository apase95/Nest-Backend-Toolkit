import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { CustomExceptionFilter } from "./common/exceptions";
import { AppValidationPipe } from "src/common/pipes";
import { LoggingInterceptor, RequestIdInterceptor, TimeoutInterceptor, TransformInterceptor } from "./common/interceptors";
import { AppLogger } from "./common/logger"; 
import helmet from "helmet";
import hpp from "hpp"; 


async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    const configService = app.get(ConfigService);

    const logger = app.get(AppLogger);
    app.useLogger(logger);

    app.use(helmet());

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

    const port = configService.get<number>("PORT") || 3000;
    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
