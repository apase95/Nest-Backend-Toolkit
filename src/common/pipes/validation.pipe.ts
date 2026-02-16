import { ValidationError, ValidationPipe } from "@nestjs/common";
import { ValidationException } from "src/common/exceptions";


export class AppValidationPipe extends ValidationPipe {
    constructor(){
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (errors: ValidationError[]) => {
                const formattedErrors = errors.map((error) => ({
                    field: error.property,
                    constraints: error.constraints,
                }));
                return new ValidationException(formattedErrors);
            },

        });
    }
};