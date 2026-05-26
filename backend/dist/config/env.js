"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
exports.env = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: requiredEnv('DB_PASSWORD'),
        database: process.env.DB_NAME || 'vitasalud',
    },
    server: {
        port: parseInt(process.env.PORT || '5000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    jwt: {
        secret: requiredEnv('JWT_SECRET'),
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
        ],
    },
    api: {
        version: process.env.API_VERSION || 'v1',
        prefix: process.env.API_PREFIX || '/api/v1',
    },
};
exports.default = exports.env;
//# sourceMappingURL=env.js.map