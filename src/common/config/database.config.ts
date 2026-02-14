import { registerAs } from "@nestjs/config";


export default registerAs("database", () => ({
    uri: process.env.MONGO_URI,
    options: {
        maxPoolSize: parseInt(process.env.MONGO_POOL_SIZE || "10"),
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        w: "majority",
    },
}));
