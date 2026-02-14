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
        this.totalPages = Math.ceil(total / limit);
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
    data?: T;
    meta?: MetaData;
    timestamp: string;

    constructor(statusCode: number, message: string, data?: T, meta?: MetaData) {
        this.success = statusCode >= 200 && statusCode < 300;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.meta = meta;
        this.timestamp = new Date().toISOString();
    }

    static success<T>(data: T, message = "Success", statusCode = 200, meta?: MetaData) {
        return new ApiResponse(statusCode, message, data, meta);
    };

    static error(message: string, statusCode = 500) {
        return new ApiResponse(statusCode, message);
    };
};
