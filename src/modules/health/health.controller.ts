import { Controller, Get, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { HealthService } from "src/modules/health/health.service";
import { ApiResponse } from "src/common/dto";


@Controller("health")
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    checkHealth() {
        return ApiResponse.success({ status: "OK" }, "Server is up and running");
    };

    @Get("status")
    async checkFullStatus(@Res() res: Response) {
        const isDbConnected = await this.healthService.checkDatabase();
        const systemHealth = this.healthService.getSystemHealth();

        if (isDbConnected) {
            return res.status(HttpStatus.OK).json(
                ApiResponse.success(
                    {
                        status: "UP",
                        database: "CONNECTED",
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