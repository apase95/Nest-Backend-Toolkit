import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { Request } from "express";


@Controller("user")
export class UserController {
    @UseGuards(JwtAuthGuard)
    @Get("me")
    getMe(@Req() req: Request) {
        return req.user;
    }
}
