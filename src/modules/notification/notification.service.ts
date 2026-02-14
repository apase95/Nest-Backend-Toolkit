import { NotificationRepository } from "./repositories/notification.repository";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ListNotificationDto } from "src/modules/notification/dto/list-notification.dto";


@Injectable()
export class NotificationService {
    constructor(private readonly notificationRepository: NotificationRepository) {}

    async send(dto: CreateNotificationDto) {
        return this.notificationRepository.create(dto);
    }

    async getMyNotifications(userId: string, query: ListNotificationDto) {
        const { page = 1, limit = 10, isRead } = query;
        const skip = (page - 1) * limit;

        const isReadBool = isRead === "true" ? true : isRead === "false" ? false : undefined;

        const { notifications, total, unreadCount } = await this.notificationRepository.findByUser(
            userId,
            skip,
            limit,
            isReadBool,
        );

        return {
            data: notifications,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                unreadCount,
            },
        };
    };

    async markAsRead(id: string, userId: string) {
        const notification = await this.notificationRepository.markAsRead(id, userId);
        if (!notification) throw new NotFoundException("Notification not found");
        return notification;
    };

    async markAllAsRead(userId: string) {
        await this.notificationRepository.markAllAsRead(userId);
        return { message: "All notifications marked as read" };
    };

    async deleteNotification(id: string, userId: string) {
        const result = await this.notificationRepository.delete(id, userId);
        if (result.deletedCount === 0) throw new NotFoundException("Notification not found");
        return { message: "Notification deleted" };
    };

    async getUnreadCount(userId: string) {
        const count = await this.notificationRepository.countUnread(userId);
        return { unreadCount: count };
    };
}
