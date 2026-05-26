"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.getClient = exports.query = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
const pool = new pg_1.Pool({
    host: env_1.env.database.host,
    port: env_1.env.database.port,
    user: env_1.env.database.user,
    password: env_1.env.database.password,
    database: env_1.env.database.database,
});
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        if (duration > 1000) {
            console.warn(`Query took ${duration}ms - Query: ${text.substring(0, 100)}`);
        }
        return result;
    }
    catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};
exports.query = query;
const getClient = () => {
    return pool.connect();
};
exports.getClient = getClient;
const closePool = async () => {
    await pool.end();
};
exports.closePool = closePool;
exports.default = pool;
//# sourceMappingURL=database.js.map