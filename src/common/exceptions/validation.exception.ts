import { HttpStatus } from "@nestjs/common";
import { AppException } from "src/common/exceptions/app.exception";


export class ValidationException extends AppException {
    constructor(public errors: any) {
        super(
            "Validation Error",
            HttpStatus.BAD_REQUEST,
            "VALIDATION_ERROR"
        )
    }
};