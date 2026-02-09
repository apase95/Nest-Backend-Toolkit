import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionService {
    constructor(
        @InjectModel(Session.name) 
        private sessionModel: Model<SessionDocument>,
    ) {}

    async createSession(
        userId: Types.ObjectId, 
        refreshToken: string, 
        userAgent?: string, 
        ip?: string
    ) {
        return this.sessionModel.create({ userId, refreshToken, userAgent, ip });
    }

    async findSessionByToken(
        refreshToken: string
    ) {
        return this.sessionModel.findOne({ refreshToken });
    }

    async updateSessionToken(
        sessionId: Types.ObjectId, 
        newRefreshToken: string
    ) {
        return this.sessionModel.findByIdAndUpdate(sessionId, { refreshToken: newRefreshToken });
    }

    async deleteSession(
        refreshToken: string
    ) {
        return this.sessionModel.deleteOne({ refreshToken });
    }
}