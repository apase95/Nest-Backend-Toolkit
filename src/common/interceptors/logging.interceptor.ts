import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { AppLogger } from "src/common/logger";


@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: AppLogger) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const { method, url } = request;
        const requestId = (request as any).requestId;
        const startTime = Date.now();

        return next.handle().pipe(
            tap(() => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                const statusCode = response.statusCode;
                this.logger.custom('info', 'HTTP Request', {
                    requestId,
                    method,
                    url,
                    statusCode,
                    duration: `${duration}ms`,
                    userAgent: request.get('user-agent'),
                    context: 'HTTP',
                });   
            }),
        );
    }
}
