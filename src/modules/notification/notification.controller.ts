import { NotificationService } from "./notification.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CreateNotificationDto, ListNotificationDto } from "./dto";
import { ApiResponse } from "src/common/dto";
import { ParseIdPipe } from "src/common/pipes";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";


@ApiTags("Notifications")
@ApiBearerAuth("access-token")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @ApiOperation({ summary: "Create a new notification (Internal use or Testing)" })
    @Post()
    async createNotification(
        @Req() req: any,
        @Body() dto: CreateNotificationDto
    ) {
        dto.userId = req.user.userId;
        const notification = await this.notificationService.send(dto);
        return ApiResponse.created(notification, "Notification created successfully");
    };

    @ApiOperation({ summary: "Get current user's notifications with pagination" })
    @Get()
    async getMyNotifications(
        @Req() req: any,
        @Query() query: ListNotificationDto
    ){
        const result = await this.notificationService.getMyNotifications(req.user.userId, query);
        return ApiResponse.success(
            result.data,
            "Notifications fetched successfully",
            200,
            result.meta as any
        );
    };

    @ApiOperation({ summary: "Get count of unread notifications" })
    @Get("unread-count")
    async getUnreadCount(@Req() req: any) {
        const result = await this.notificationService.getUnreadCount(req.user.userId);
        return ApiResponse.success(result, "Unread count fetched successfully");
    };
    
    @ApiOperation({ summary: "Mark all notifications as read" })
    @Patch("read-all")
    async markAllAsRead(@Req() req: any) {
        await this.notificationService.markAllAsRead(req.user.userId);
        return ApiResponse.success(null, "All notifications marked as read");
    };
    
    @ApiOperation({ summary: "Mark a specific notification as read" })
    @Patch(":id/read")
    async markAsRead(
        @Req() req: any,
        @Param("id", ParseIdPipe) id: string, 
    ) {
        const notification = await this.notificationService.markAsRead(id, req.user.userId);
        return ApiResponse.success(notification, "Notification marked as read");
    };

    @ApiOperation({ summary: "Delete a notification" })
    @Delete(":id")
    async deleteNotification(
        @Req() req: any,
        @Param("id", ParseIdPipe) id: string,
    ){
        await this.notificationService.deleteNotification(id, req.user.userId);
        return ApiResponse.success(null, "Notification deleted successfully");
    };
};