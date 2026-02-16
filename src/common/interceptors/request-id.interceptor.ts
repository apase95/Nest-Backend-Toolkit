import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { nanoid } from "src/common/utils";


@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const requestId = request.headers["x-request-id"] || nanoid();
        
        (request as any).requestId = requestId;
        response.setHeader("x-header-id", requestId as string);

        return next.handle();
    }
};