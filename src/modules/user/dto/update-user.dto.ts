import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "src/modules/user/schemas/user.schema";


export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    displayName?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
};

export class ChangePhoneDto {
    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;
};

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    oldPassword!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword!: string;
};

export class ChangeRoleDto {
    @IsNotEmpty()
    @IsEnum(UserRole)
    role!: UserRole;
};

export class AdminResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword!: string;
};

export class UserQueryDto {
    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;
};