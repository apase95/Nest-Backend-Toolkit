import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { AppException } from "src/common/exceptions/app.exception";
import { ValidationException } from "src/common/exceptions/validation.exception";



@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(CustomExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal server error";
        let errorCode = "INTERNAL_ERROR";
        let errors = null;

        if (exception instanceof AppException) {
            status = exception.getStatus();
            message = exception.message;
            errorCode = exception.errorCode || "APP_ERROR";
            if (exception instanceof ValidationException) {
                errors = exception.errors;
            }
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const resBody: any = exception.getResponse();
            message = typeof resBody === "string" ? resBody : resBody.message || exception.message;
            if (Array.isArray(message)) {
                message = message[0];
                errors = resBody.message;
            }
            errorCode = resBody.error || "HTTP_ERROR";
        } else {
            this.logger.error(`Unhandled Exception: ${exception}`);
            if (exception instanceof Error) console.error(exception.stack);
        }

        const responseBody = {
            success: false,
            statusCode: status,
            message: message,
            errorCode: errorCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };

        response.status(status).json(responseBody);
    }
};