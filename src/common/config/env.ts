import { z } from "zod";

export const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(["developer", "production", "test"]).default("developer"),
    CLIENT_URL: z.url(),

    MONGO_URI: z.url().min(1),

    JWT_ACCESS_SECRET: z.string().min(1),
    JWT_ACCESS_EXPIRATION: z.string().default("15m"),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRATION: z.string().default("7d"),

    API_KEY: z.string().min(1),

    THROTTLE_TTL: z.coerce.number().default(60),
    THROTTLE_LIMIT: z.coerce.number().default(10),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validate = (config: Record<string, unknown>) => {
    const result = envSchema.safeParse(config);
    if (!result.success) {
        console.error("Invalid environment variables:", result.error);
        throw new Error("Invalid environment variables");
    }

    return result.data;
};
