import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter, ValidationExceptionFilter } from "./common/filters";
import { CustomExceptionFilter, ValidationException } from "./common/exceptions";


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors) => {
                const formattedErrors = errors.map(error => ({
                    field: error.property,
                    constraints: error.constraints,
                }));
                return new ValidationException(formattedErrors);
            },
        }),
    );

    app.useGlobalFilters(new CustomExceptionFilter());

    app.enableCors(configService.get("security.cors"));

    const port = configService.get<number>("PORT") || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
