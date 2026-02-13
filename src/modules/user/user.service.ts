import { User } from 'src/modules/user/schemas/user.schema';
import { ChangePasswordDto, ChangePhoneDto, AdminResetPasswordDto, UpdateProfileDto } from './dto/update-user.dto';
import { UserQueryDto } from 'src/modules/user/dto/list-user.dto';
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserDocument, UserRole } from "./schemas/user.schema";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";
import * as bcrypt from "bcrypt";


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async create(
        dto: CreateUserDto,
    ): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email: dto.email });
        if (existingUser) throw new BadRequestException("Email already exists");
        return this.userModel.create(dto);
    };

    async findByEmail(
        email: string, 
        includePassword = false,
    ): Promise<UserDocument | null> {
        const query = this.userModel.findOne({ email, isDeleted: false });
        if (includePassword) query.select("+password");
        return query.exec();
    };

    async findById(
        id: string,
    ): Promise<UserDocument> {
        const user = await this.userModel.findById(id);
        if (!user) throw new NotFoundException("User not found");
        return user;
    };

    async findByIdWithoutPassword(id: string): Promise<any> {
        const user = await this.userModel
            .findById(id)
            .where({ isDeleted: false })
            .select("-password")
            .lean();
        if (!user) throw new NotFoundException(`User not found ${id}`);
        return user;
    };

    async validateUserForAuth(
        email: string,
    ): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).select("+password +isLocked +isDeleted +role");
    };

    async updateUserProfile(
        userId: string,
        dto: UpdateProfileDto,
    ): Promise<UserDocument> {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, dto, { new: true })
            .where({ isDeleted: false });
        if (!updatedUser) throw new NotFoundException("User not found");
        return updatedUser;
    };

    async changePhone(
        userId: string,
        dto: ChangePhoneDto,
    ): Promise<UserDocument> {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, { phoneNumber: dto.phoneNumber }, { new: true })
            .where({ isDeleted: false });
        if (!updatedUser) throw new NotFoundException("User not found");
        return updatedUser;
    };

    async changePassword(
        userId: string,
        dto: ChangePasswordDto,
    ): Promise<void> {
        const user = await this.userModel.findById(userId).select("+password").where({ isDeleted: false });
        if (!user) throw new NotFoundException("User not found");
        if (!user.password) throw new BadRequestException("Social account cannot change password directly");

        const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
        if (!isMatch) throw new BadRequestException("Old password is incorrect");

        user.password = dto.newPassword;
        await user.save();
    };

    async findAllUsers(query: UserQueryDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const filter: any = { isDeleted: false };
        if (search) {
            filter.$or = [
                { email: { $regex: search, $options: 'i' } },
                { displayName: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
            ];
        }

        const [users, total] = await Promise.all([
            this.userModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
            this.userModel.countDocuments(filter).exec()
        ]);

        return {
            data: users,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            }
        };
    };

    async deleteUser(
        adminId: string,
        userId: string,
    ): Promise<void> {
        if (adminId === userId) throw new BadRequestException("You cannot delete yourself");
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException("User not found");

        user.isDeleted = true;
        await user.save();
    };

    async toggleUserLock(
        adminId: string,
        userId: string,
    ): Promise<{ isLocked: boolean }> {
        if (adminId === userId) throw new BadRequestException("You cannot lock yourself");
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException("User not found");

        user.isLocked = !user.isLocked;
        await user.save();
        return { isLocked: user.isLocked };
    };

    async changeUserRole(
        adminId: string,
        userId: string,
        role: UserRole,
    ): Promise<{ role: string }> {
        if (adminId === userId) throw new BadRequestException("You cannot change your own role");
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException("User not found");

        user.role = role;
        await user.save();
        return { role: user.role };
    };

    async adminResetPassword(
        userId: string,
        dto: AdminResetPasswordDto,
    ): Promise<void> {
        const user = await this.userModel.findById(userId).where({ isDeleted: false });
        if (!user) throw new NotFoundException("User not found");

        user.password = dto.newPassword;
        await user.save();
    };
};

