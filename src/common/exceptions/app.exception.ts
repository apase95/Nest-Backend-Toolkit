import { HttpException, HttpStatus } from "@nestjs/common";


export class AppException extends HttpException {
    constructor(
        message: string,
        statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
        public errorCode?: string,
    ) {
        super(message, statusCode);
    }
};