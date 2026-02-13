import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";


@Injectable()
export class HealthService {
    constructor(@InjectConnection() private readonly connection: Connection) {}

    async checkDatabase(): Promise<boolean> {
        return this.connection.readyState === 1;
    };

    getSystemHealth() {
        return {
            uptime: process.uptime(),
            message: "Server is running!",
            timestamp: new Date().toISOString(),
            memoryUsage: process.memoryUsage(),
        };
    };
};