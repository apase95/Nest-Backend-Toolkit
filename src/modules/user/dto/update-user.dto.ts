import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "src/modules/user/schemas/user.schema";


export class UpdateProfileDto {
    @ApiPropertyOptional({ example: "Nooby Ho", description: "Display name of the user" })
    @IsOptional()
    @IsString()
    displayName?: string;

    @ApiPropertyOptional({ example: "Nooby", description: "First name" })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ example: "Ho", description: "Last name" })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({ example: "https://example.com/avatar.jpg", description: "Avatar URL" })
    @IsOptional()
    @IsString()
    avatarUrl?: string;
};

export class ChangePhoneDto {
    @ApiProperty({ example: "0912345678", description: "New phone number" })
    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;
};

export class ChangePasswordDto {
    @ApiProperty({ example: "oldPassword123", description: "Current password" })
    @IsNotEmpty()
    @IsString()
    oldPassword!: string;

    @ApiProperty({ example: "newPassword123", description: "New password (min 6 chars)", minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword!: string;
};

export class ChangeRoleDto {
    @ApiProperty({ enum: UserRole, example: UserRole.ADMIN, description: "Role to assign" })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role!: UserRole;
};

export class AdminResetPasswordDto {
    @ApiProperty({ example: "newPassword123", description: "New password set by admin", minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword!: string;
};
