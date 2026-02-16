import { HttpStatus } from "@nestjs/common";
import { AppException } from "src/common/exceptions/app.exception";


export class InvalidCredentialsException extends AppException {
    constructor() {
        super(
            "Invalid email or password",
            HttpStatus.UNAUTHORIZED,
            "AUTH_INVALID_CREDENTIALS"
        )
    }
};

export class TokenExpiredException extends AppException {
    constructor() {
        super(
            "Token has expired",
            HttpStatus.UNAUTHORIZED,
            "AUTH_TOKEN_EXPIRED"
        )
    }
};

export class InvalidTokenException extends AppException {
    constructor() {
        super(
            "Invalid token",
            HttpStatus.UNAUTHORIZED,
            "AUTH_TOKEN_INVALID"
        )
    }
};

export class AccountLockedException extends AppException {
    constructor() {
        super(
            "Account has been locked",
            HttpStatus.FORBIDDEN,
            "AUTH_ACCOUNT_LOCKED"
        )
    }
};

export class AccountDeletedException extends AppException {
    constructor() {
        super(
            "Account has been deleted",
            HttpStatus.FORBIDDEN,
            "AUTH_ACCOUNT_DELETED"
        )
    }
};

export class AccessDeniedException extends AppException {
    constructor() {
        super(
            "Access denied",
            HttpStatus.FORBIDDEN,
            "AUTH_ACCESS_DENIED"
        )
    }
};