import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { RolesGuard, JwtAuthGuard } from "src/common/guards";
import { UserService } from "src/modules/user/user.service";
import { CreateUserDto, UpdateProfileDto, ChangePasswordDto, ChangePhoneDto, ChangeRoleDto, AdminResetPasswordDto } from "./dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/modules/user/schemas/user.schema";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "src/common/storage";
import { ApiResponse, PaginationDto } from "src/common/dto";
import { ParseIdPipe } from "src/common/pipes";


@Controller("user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Get("me")
    async getMe(@Req() req: any) {
        const user = await this.userService.findByIdWithoutPassword(req.user.userId);
        return ApiResponse.success(user, "Profile fetched successfully");
    };

    @Put("me")
    async updateUserProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
        const user = await this.userService.updateUserProfile(req.user.userId, dto);
        return ApiResponse.success(user, "Profile updated successfully");
    };

    @Patch("me/phone")
    async changePhone(@Req() req: any, @Body() dto: ChangePhoneDto) {
        const user = await this.userService.changePhone(req.user.userId, dto);
        return ApiResponse.success(user, "Phone number updated successfully");
    };

    @Patch("me/password")
    async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
        const user = await this.userService.changePassword(req.user.userId, dto);
        return ApiResponse.success(null, "Password updated successfully");
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
        return ApiResponse.success(
            { url: result.secure_url, publicId: result.public_id },
            "Avatar updated successfully"
        );
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
    async getUserById(@Param("id", ParseIdPipe) id: string) {
        const user = await this.userService.findById(id);
        return ApiResponse.success(user, "User fetched successfully");
    };
    
    @Roles(UserRole.ADMIN)
    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        const user = await this.userService.create(dto);
        return ApiResponse.created(user, "User created successfully");
    };

    @Roles(UserRole.ADMIN)
    @Delete(":id")
    async deleteUser(@Req() req: any, @Param("id", ParseIdPipe) id: string) {
        await this.userService.deleteUser(req.user.userId, id);
        return ApiResponse.success(null, "User deleted successfully");
    };

    @Roles(UserRole.ADMIN)
    @Patch(":id/lock")
    async toggleUserLock(@Req() req: any, @Param("id", ParseIdPipe) id: string) {
        const result = await this.userService.toggleUserLock(req.user.userId, id);
        return ApiResponse.success(result, "User lock status updated");
    };

    @Roles(UserRole.ADMIN)
    @Patch(":id/role")
    async changeUserRole(@Req() req: any, @Param("id", ParseIdPipe) id: string, @Body() dto: ChangeRoleDto) {
        const result = await this.userService.changeUserRole(req.user.userId, id, dto.role);
        return ApiResponse.success(result, "User role updated successfully");
    };

    @Roles(UserRole.ADMIN)
    @Patch(":id/reset-password")
    async adminResetPassword(@Param("id", ParseIdPipe) id: string, @Body() dto: AdminResetPasswordDto) {
        await this.userService.adminResetPassword(id, dto);
        return ApiResponse.success(null, "User password reset successfully");
    };
};