import { Controller, Get, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { HealthService } from "src/modules/health/health.service";
import { ApiResponse } from "src/common/dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";


@ApiTags("Health")
@Controller("health")
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @ApiOperation({ summary: "Liveness Probe (Check if server is running)" })
    @Get()
    checkHealth() {
        return ApiResponse.success({ status: "OK" }, "Server is up and running");
    };

    @ApiOperation({ summary: "Readiness Probe (Check DB connection & System Health)" })
    @Get("status")
    async checkFullStatus(@Res() res: Response) {
        const isDbConnected = await this.healthService.checkDatabase();
        const isRedisConnected = await this.healthService.checkRedis();
        const systemHealth = this.healthService.getSystemHealth();

        const isHealthy = isDbConnected && isRedisConnected;
        if (isHealthy) {
            return res.status(HttpStatus.OK).json(
                ApiResponse.success(
                    {
                        status: "UP",
                        database: "CONNECTED",
                        redis: "CONNECTED",
                        system: systemHealth,
                    }, 
                    "System operational"
                )
            );
        } else {
            return res.status(HttpStatus.SERVICE_UNAVAILABLE).json(
                ApiResponse.error(
                    "System degraded: Database disconnected", 
                    HttpStatus.SERVICE_UNAVAILABLE
                )
            );
        }
    };
};