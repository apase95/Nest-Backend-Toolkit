import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { RolesGuard, JwtAuthGuard } from "src/common/guards";
import { UserService } from "src/modules/user/user.service";
import { CreateUserDto, UpdateProfileDto, ChangePasswordDto, ChangePhoneDto, ChangeRoleDto, AdminResetPasswordDto } from "./dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/modules/user/schemas/user.schema";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "src/common/storage";
import { ApiResponse, PaginationDto } from "src/common/dto";


@Controller("user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Get("me")
    async getMe(@Req() req: any) {
        return this.userService.findByIdWithoutPassword(req.user.userId);
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

    @Put("me/avatar")
    @UseInterceptors(FileInterceptor("avatar"))
    async updateAvatar(
        @Req() req: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        const result = await this.cloudinaryService.uploadImage(file);
        await this.userService.updateUserProfile(req.user.userId, {
            avatarUrl: result.secure_url
        });
        return { 
            message: "Avatar updated successfully",
            url: result.secure_url, 
            publicId: result.public_id 
        };
    };

    @Roles(UserRole.ADMIN)
    @Get()
    async getUsers(@Query() query: PaginationDto) {
        const result = await this.userService.findAllUsers(query);
        return ApiResponse.success(
            result.data,
            "List users fetched successfully",
            200,
            result.meta,
        );
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