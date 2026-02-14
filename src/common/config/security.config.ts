import { registerAs } from "@nestjs/config";


export default registerAs("security", () => ({
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRATION,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION,
    },
    apiKey: process.env.API_KEY,
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
    rateLimit: {
        ttl: parseInt(process.env.THROTTLE_TTL || "60", 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || "10", 10),
    },
}));
