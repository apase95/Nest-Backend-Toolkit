import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";


@Injectable()
export class HashService {
    private readonly SALT_ROUNDS = 10;

    async hashPassword(plainPassword: string): Promise<string> {
        return await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
    };

    async comparePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    };
};