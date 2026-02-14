import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from "express";


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();

        const message =
            typeof exceptionResponse === "string" 
                ? exceptionResponse 
                : exceptionResponse.message || exception.message;

        const errorResponse = {
            success: false,
            statusCode: status,
            message: Array.isArray(message) ? message[0] : message,
            error: exception.name,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };

        this.logger.error(
            `${request.method} ${request.url} ${status} - ${JSON.stringify(errorResponse)}`
        );

        response.status(status).json(errorResponse);
    }
}
