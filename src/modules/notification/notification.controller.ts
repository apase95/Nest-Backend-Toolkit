import { NotificationService } from './notification.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CreateNotificationDto } from 'src/modules/notification/dto/create-notification.dto';
import { ListNotificationDto } from "src/modules/notification/dto/list-notification.dto";



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
        return this.notificationService.send(dto);
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
        return this.notificationService.getUnreadCount(req.user.userId);
    };
    
    @Patch("read-all")
    async markAllAsRead(@Req() req: any) {
        return this.notificationService.markAllAsRead(req.user.userId);
    };
    
    @Patch(":id/read")
    async markAsRead(
        @Req() req: any,
        @Param("id") id: string, 
    ) {
        return this.notificationService.markAsRead(id, req.user.userId);
    };

    @Delete(":id")
    async deleteNotification(
        @Req() req: any,
        @Param("id") id: string,
    ){
        return this.notificationService.deleteNotification(id, req.user.userId);
    };
};