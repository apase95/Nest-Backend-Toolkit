import { NotificationService } from "./notification.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CreateNotificationDto, ListNotificationDto } from "./dto";
import { ApiResponse } from "src/common/dto";


@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    async createNotification(
        @Req() req: any,
        @Body() dto: CreateNotificationDto
    ) {
        dto.userId = req.user.userId;
        const notification = await this.notificationService.send(dto);
        return ApiResponse.created(notification, "Notification created successfully");
    };

    @Get()
    async getMyNotifications(
        @Req() req: any,
        @Query() query: ListNotificationDto
    ){
        return this.notificationService.getMyNotifications(req.user.userId, query);
    };

    @Get("unread-count")
    async getUnreadCount(@Req() req: any) {
        const result = await this.notificationService.getUnreadCount(req.user.userId);
        return ApiResponse.success(result, "Unread count fetched successfully");
    };
    
    @Patch("read-all")
    async markAllAsRead(@Req() req: any) {
        await this.notificationService.markAllAsRead(req.user.userId);
        return ApiResponse.success(null, "All notifications marked as read");
    };
    
    @Patch(":id/read")
    async markAsRead(
        @Req() req: any,
        @Param("id") id: string, 
    ) {
        const notification = await this.notificationService.markAsRead(id, req.user.userId);
        return ApiResponse.success(notification, "Notification marked as read");
    };

    @Delete(":id")
    async deleteNotification(
        @Req() req: any,
        @Param("id") id: string,
    ){
        await this.notificationService.deleteNotification(id, req.user.userId);
        return ApiResponse.success(null, "Notification deleted successfully");
    };
};