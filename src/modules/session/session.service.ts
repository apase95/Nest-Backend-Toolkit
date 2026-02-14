import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Session, SessionDocument } from "./schemas/session.schema";
import ms, { StringValue } from "ms"; 


@Injectable()
export class SessionService {
    constructor(
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
        private configService: ConfigService
    ) {}

    async createSession(
        userId: Types.ObjectId, 
        refreshToken: string,
        userAgent?: string,
        ipAddress?: string,
        sessionId?: Types.ObjectId,
    ): Promise<SessionDocument> {
        const refreshExpiresIn = this.configService.get<string>("security.jwt.refreshExpiresIn", "7d"); 
        const expireAt = new Date(Date.now() + ms(refreshExpiresIn as StringValue));

        return this.sessionModel.create({
            _id: sessionId,
            userId, 
            refreshToken,
            userAgent,
            ipAddress,
            expireAt,
        });
    };

    async findSessionByToken(refreshToken: string): Promise<SessionDocument | null>{
        return this.sessionModel.findOne({ refreshToken }).exec();
    };

    async findSessionById(sessionId: string): Promise<SessionDocument | null>{
        return this.sessionModel.findById(sessionId).exec();
    };

    async updateSessionToken(
        sessionId: Types.ObjectId, 
        newRefreshToken: string
    ): Promise<void>{
        const refreshExpiresIn = this.configService.get<string>("security.jwt.refreshExpiresIn", "7d");
        const expireAt = new Date(Date.now() + ms(refreshExpiresIn as StringValue));

        await this.sessionModel.updateOne(
            { _id: sessionId },
            { refreshToken: newRefreshToken, expireAt },
        );
    };

    async deleteSession(refreshToken: string): Promise<void> {
        await this.sessionModel.deleteOne({ refreshToken }).exec();
    };
    
    async deleteSessionById(sessionId: string): Promise<void> {
        await this.sessionModel.deleteOne({ _id: sessionId }).exec();
    };

    async revokeAllSessions(userId: string): Promise<void> {
        await this.sessionModel.deleteMany({ userId }).exec();
    };
}