import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from "@nestjs/common";
import { Response } from "express";


@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();

        let errorMessage = "Validation Error";
        let errors = null;

        if (typeof exceptionResponse === "object" && exceptionResponse.message) {
            if (Array.isArray(exceptionResponse.message)) {
                errorMessage = exceptionResponse.message[0];
                errors = exceptionResponse.message;
            } else {
                errorMessage = exceptionResponse.message;
            }
        }

        response.status(status).json({
            success: false,
            statusCode: status,
            message: errorMessage,
            errors: errors,
            timestamp: new Date().toISOString(),
        });
    }
}
