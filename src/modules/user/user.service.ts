import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument, UserRole } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async create(
        createUserDto: CreateUserDto
    ): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }
        return this.userModel.create(createUserDto);
    };

    async findByEmail(
        email: string, 
        includePassword = false
    ): Promise<UserDocument | null> {
        const query = this.userModel.findOne({ email, isDeleted: false });
        if (includePassword) {
           query.select("+password");
        }
        return query.exec();
    };

    async findById(
        id: string,
    ): Promise<UserDocument> {
        const user = await this.userModel.findById(id).where({ isDelete: false });
        if (!user) throw new NotFoundException("User not found");
        return user;
    };

    async validateUserForAuth(
        email: string
    ): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).select("+password +isLocked +isDelete +role");
    };
};

