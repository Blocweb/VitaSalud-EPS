"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const getUsers = async (req, res) => {
    try {
        const result = await (0, database_1.query)(`SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.phone, u.status, r.name as role, u.created_at
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.deleted_at IS NULL
       ORDER BY u.created_at DESC`);
        res.status(200).json({
            success: true,
            data: result.rows,
            total: result.rows.length,
        });
    }
    catch (error) {
        const appError = (0, errors_1.handleError)(error);
        res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
        });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.phone, u.status, u.avatar_url, r.name as role, u.created_at
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1 AND u.deleted_at IS NULL`, [id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'User not found');
        }
        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        const appError = (0, errors_1.handleError)(error);
        res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
        });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, avatar_url } = req.body;
        // Check if user exists
        const existingUser = await (0, database_1.query)(`SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL`, [id]);
        if (existingUser.rows.length === 0) {
            throw new errors_1.AppError(404, 'User not found');
        }
        // Update user
        const result = await (0, database_1.query)(`UPDATE users SET first_name = $1, last_name = $2, phone = $3, avatar_url = $4
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING id, email, first_name, last_name, phone, status, avatar_url`, [first_name, last_name, phone, avatar_url, id]);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result.rows[0],
        });
    }
    catch (error) {
        const appError = (0, errors_1.handleError)(error);
        res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
        });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Soft delete
        await (0, database_1.query)(`UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        const appError = (0, errors_1.handleError)(error);
        res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
        });
    }
};
exports.deleteUser = deleteUser;
exports.default = {
    getUsers: exports.getUsers,
    getUserById: exports.getUserById,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser,
};
//# sourceMappingURL=users.controller.js.map