import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { Request } from "express";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UserService } from "src/modules/user/user.service";
import { AdminResetPasswordDto, ChangePasswordDto, ChangePhoneDto, ChangeRoleDto, UpdateProfileDto, UserQueryDto } from "src/modules/user/dto/update-user.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/modules/user/schemas/user.schema";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";


@Controller("user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("me")
    getMe(@Req() req: Request) {
        return req.user;
    };

    @Put("me")
    async updateUserProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
        return this.userService.updateUserProfile(req.user.userId, dto);
    };

    @Patch("me/phone")
    async changePhone(@Req() req: any, @Body() dto: ChangePhoneDto) {
        return this.userService.changePhone(req.user.userId, dto);
    };

    @Patch("me/password")
    async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
        return this.userService.changePassword(req.user.userId, dto);
    };

    @Roles(UserRole.ADMIN)
    @Get()
    async getUsers(@Query() query: UserQueryDto) {
        return this.userService.findAllUsers(query);
    };

    @Roles(UserRole.ADMIN)
    @Get(":id")
    async getUserById(@Param("id") id: string) {
        return this.userService.findById(id);
    };
    
    @Roles(UserRole.ADMIN)
    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    };


    @Roles(UserRole.ADMIN)
    @Delete(":id")
    async deleteUser(@Req() req: any, @Param("id") id: string) {
        return this.userService.deleteUser(req.user.userId, id);
    };

    @Roles(UserRole.ADMIN)
    @Patch(":id/lock")
    async toggleUserLock(@Req() req: any, @Param("id") id: string) {
        return this.userService.toggleUserLock(req.user.userId, id);
    };

    @Roles(UserRole.ADMIN)
    @Patch(":id/role")
    async changeUserRole(@Req() req: any, @Param("id") id: string, @Body() dto: ChangeRoleDto) {
        return this.userService.changeUserRole(req.user.userId, id, dto.role);
    };

    @Roles(UserRole.ADMIN)
    @Patch(":id/reset-password")
    async adminResetPassword(@Param("id") id: string, @Body() dto: AdminResetPasswordDto) {
        return this.userService.adminResetPassword(id, dto);
    };
};