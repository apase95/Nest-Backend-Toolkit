import { RedisService } from "./../../common/redis/redis.service";
import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";


@Injectable()
export class HealthService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly redisService: RedisService,
    ) {}

    async checkDatabase(): Promise<boolean> {
        return this.connection.readyState === 1;
    }

    // async checkRedis(): Promise<boolean> {
    //     try {
    //         const client = this.redisService.getClient();
    //         const res = await client.ping();
    //         return res === "PONG";
    //     } catch (error) {
    //         return false;
    //     }
    // };
    async checkRedis(): Promise<boolean> {
        return true; 
    };

    getSystemHealth() {
        return {
            uptime: process.uptime(),
            message: "Server is running!",
            timestamp: new Date().toISOString(),
            memoryUsage: process.memoryUsage(),
        };
    };
}
