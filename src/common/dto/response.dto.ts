export class MetaData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore?: boolean;

    constructor(total: number, page: number, limit: number) {
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
        this.hasMore = page < this.totalPages;
    }

    get remaining(): number {
        return Math.max(0, this.total - (this.page * this.limit));
    };

    get skip(): number {
        return (this.page - 1) * this.limit;
    };

    get isLastPage(): boolean {
        return this.page >= this.totalPages;
    };
};

export class ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T | null;
    meta?: MetaData;
    timestamp: string;

    constructor(statusCode: number, message: string, data?: T, meta?: MetaData) {
        this.success = statusCode >= 200 && statusCode < 300;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data ?? null;
        this.meta = meta;
        this.timestamp = new Date().toISOString();
    }

    static created<T>(
        data: T, 
        message = "Created successfully"
    ) {
        return new ApiResponse(201, message, data);
    };

    static success<T>(
        data: T, 
        message = "Success", 
        statusCode = 200, 
        meta?: MetaData
    ) {
        return new ApiResponse(statusCode, message, data, meta);
    };

    static error(
        message: string, 
        statusCode = 500
    ) {
        return new ApiResponse(statusCode, message);
    };

    static noContent(message = "No Content") {
        return new ApiResponse(204, message);
    };

    static badRequest(message = "Bad Request") {
        return new ApiResponse(400, message);
    };

    static unauthorized(message = "Unauthorized") {
        return new ApiResponse(401, message);
    };

    static forbidden(message = "Forbidden") {
        return new ApiResponse(403, message);
    };

    static notFound(message = "Resource not found") {
        return new ApiResponse(404, message);
    };

    static conflict(message = "Resource already exists") {
        return new ApiResponse(409, message);
    };

    static paginated<T>(
        data: T[], 
        total: number, 
        page: number, 
        limit: number, 
        message = "List retrieved successfully"
    ) {
        const meta = new MetaData(total, page, limit);
        return new ApiResponse(200, message, data, meta);
    };
};
