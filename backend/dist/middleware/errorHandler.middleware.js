"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    if (error instanceof errors_1.AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            statusCode: error.statusCode,
        });
    }
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        statusCode: 500,
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
exports.default = {
    errorHandler: exports.errorHandler,
    asyncHandler: exports.asyncHandler,
};
//# sourceMappingURL=errorHandler.middleware.js.map