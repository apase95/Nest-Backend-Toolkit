import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateNotificationDto } from "src/modules/notification/dto/create-notification.dto";
import { Notification, NotificationDocument } from "../schemas/notification.schema";


@Injectable()
export class NotificationRepository {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) {}

    async create(data: CreateNotificationDto): Promise<NotificationDocument> {
        return this.notificationModel.create({
            ...data,
            userId: new Types.ObjectId(data.userId),
        });
    };

    async findByUser(
        userId: string,
        skip: number,
        limit: number,
        isRead?: boolean,
    ) {
        const filter: any = { userId: new Types.ObjectId(userId) };
        if (isRead !== undefined) filter.isRead = isRead;

        const [notifications, total, unreadCount] = await Promise.all([
            this.notificationModel
                .find(filter).sort({ createdAt: -1 })
                .skip(skip).limit(limit).exec(),
            this.notificationModel.countDocuments(filter).exec(),
            this.notificationModel.countDocuments({
                userId: new Types.ObjectId(userId),
                isRead: false,
            }).exec(),
        ]);

        return { notifications, total, unreadCount };
    };

    async findById(id: string): Promise<NotificationDocument | null> {
        return this.notificationModel.findById(id).exec();
    };

    async markAsRead(
        id: string,
        userId: string
    ): Promise<NotificationDocument | null> {
        return this.notificationModel.findOneAndUpdate(
            { _id: id, userId: new Types.ObjectId(userId) },
            { isRead: true },
        ).exec();
    };

    async markAllAsRead(userId: string) {
        return this.notificationModel.updateMany(
            { userId: new Types.ObjectId(userId), isRead: false },
            { isRead: true },
        ).exec();
    };

    async delete(id: string, userId: string) {
        return this.notificationModel.deleteOne({
            _id: id,
            userId: new Types.ObjectId(userId),
        }).exec();
    };

    async countUnread(userId: string): Promise<number> {
        return this.notificationModel.countDocuments({
            userId: new Types.ObjectId(userId),
            isRead: false,
        }).exec();
    };
};