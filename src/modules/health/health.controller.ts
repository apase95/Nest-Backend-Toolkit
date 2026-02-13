import { Controller, Get, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { HealthService } from "src/modules/health/health.service";


@Controller()
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    checkHealth() {
        return { status: "OK" };
    }

    @Get()
    async checkFullStatus(@Res() res: Response) {
        const isDbConnected = await this.healthService.checkDatabase();
        const systemHealth = this.healthService.getSystemHealth();

        if (isDbConnected) {
            return res.status(HttpStatus.OK).json({
                status: "UP",
                database: "CONNECTED",
                system: systemHealth,
            });
        } else {
            return res.status(HttpStatus.OK).json({
                status: "DOWN",
                database: "DISCONNECTED",
                system: systemHealth,
            });
        }
    };
};