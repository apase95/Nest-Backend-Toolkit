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
        origin: (origin, callback) => {
            const clientUrl = process.env.CLIENT_URL || "";
            const allowOrigins = clientUrl.split(",").map(url => url.trim());
            if (!origin || allowOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-API-Key", "X-Request-ID"],
        exposedHeaders: ["Content-Range", "X-Total-Count"],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    },
    rateLimit: {
        ttl: parseInt(process.env.THROTTLE_TTL || "60000", 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || "10", 10),
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    linkedin: {
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackUrl: process.env.LINKEDIN_CALLBACK_URL,
    },
}));
