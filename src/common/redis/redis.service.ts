import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis, { RedisOptions } from "ioredis";


@Injectable()
export class RedisService implements OnModuleDestroy {
    // private readonly redisClient: Redis;
    private readonly logger = new Logger(RedisService.name);

    constructor(private readonly configService: ConfigService) {
        // const host = this.configService.get<string>("redis.host");
        // const port = this.configService.get<number>("redis.port");
        // const password = this.configService.get<string>("redis.password");
        // const keyPrefix = this.configService.get<string>("redis.prefix");

        // const options: RedisOptions = {
        //     host,
        //     port,
        //     keyPrefix,
        //     retryStrategy: (times) => {
        //         this.logger.warn(`Retrying redis connection attempt #${times}`);
        //         return Math.min(times * 50, 2000);
        //     },
        // };

        // if (password && password.trim() !== "") {
        //     options.password = password;
        // }

        // this.redisClient = new Redis(options);

        // this.redisClient.on("connect", () => {
        //     this.logger.log(`Connected to Redis at ${host}:${port}`);
        // });

        // this.redisClient.on("error", (error) => {
        //     this.logger.error(`Redis connection error: ${error.message}`);
        // });

        this.logger.warn("⚠️ REDIS IS TURNED OFF TO TEST FLOW!");
    }

    onModuleDestroy() {
        // this.redisClient.disconnect();   
    }

    // getClient(): Redis {
    //     return this.redisClient;
    // }

    getClient(): any {
        return null;
    }

    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        return;
    }

    async get<T>(key: string): Promise<T | null> {
        return null;
    }

    async del(key: string): Promise<void> {
        return;
    }

    async delByPattern(pattern: string): Promise<void> {
        return;
    }

    // async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    //     const data = typeof value === "object" ? JSON.stringify(value) : String(value);
    //     if (ttlSeconds) {
    //         await this.redisClient.set(key, data, "EX", ttlSeconds);
    //     } else {
    //         await this.redisClient.set(key, data);
    //     }
    // }

    // async get<T>(key: string): Promise<T | null> {
    //     const data = await this.redisClient.get(key);
    //     if (!data) return null;
    //     try {
    //         return JSON.parse(data) as T;
    //     } catch (error) {
    //         return data as unknown as T;
    //     }
    // }

    // async del(key: string): Promise<void> {
    //     await this.redisClient.del(key);
    // }

    // async delByPattern(pattern: string): Promise<void> {
    //     const keys = await this.redisClient.keys(`*${pattern}*`);
    //     if (keys.length > 0) {
    //         const prefix = this.configService.get<string>("redis.prefix") || "";
    //         const keyWithoutPrefix = keys.map(k => k.replace(prefix, ""));
    //         await this.redisClient.del(...keyWithoutPrefix);
    //     }
    // }
}