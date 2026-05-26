"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
const handleError = (error) => {
    if (error instanceof AppError) {
        return error;
    }
    if (error.code === '23505') {
        // Unique constraint violation
        const field = error.detail?.match(/Key \((.*?)\)/)?.[1] || 'field';
        return new AppError(409, `${field} already exists`, true);
    }
    if (error.code === '23503') {
        // Foreign key constraint violation
        return new AppError(400, 'Referenced record does not exist', true);
    }
    if (error.code === '23502') {
        // NOT NULL constraint violation
        return new AppError(400, 'Missing required field', true);
    }
    return new AppError(500, error.message || 'Internal Server Error', false);
};
exports.handleError = handleError;
exports.default = {
    AppError,
    handleError: exports.handleError,
};
//# sourceMappingURL=errors.js.map