import * as crypto from "crypto";


const URL_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const DIGITS = "0123456789";

export const nanoid = (length = 21): string => {
    let result = "";
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; ++i) {
        result += URL_ALPHABET[bytes[i] % URL_ALPHABET.length];
    }

    return result;
};

export const generateOtp = (length = 6): string => {
    let otp = "";
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; ++i) {
        otp += DIGITS[bytes[i] % 10];
    }

    return otp;
};

export const uuid = (): string => {
    return crypto.randomUUID();
};