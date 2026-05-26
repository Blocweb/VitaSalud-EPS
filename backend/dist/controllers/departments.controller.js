"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getDepartmentById = exports.getDepartments = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const getDepartments = async (req, res) => {
    try {
        const result = await (0, database_1.query)(`SELECT d.*, u.first_name || ' ' || u.last_name as head_doctor_name
       FROM departments d
       LEFT JOIN users u ON d.head_doctor_id = u.id
       WHERE d.deleted_at IS NULL
       ORDER BY d.name`);
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
exports.getDepartments = getDepartments;
const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT d.*, u.first_name || ' ' || u.last_name as head_doctor_name
       FROM departments d
       LEFT JOIN users u ON d.head_doctor_id = u.id
       WHERE d.id = $1 AND d.deleted_at IS NULL`, [id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Department not found');
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
exports.getDepartmentById = getDepartmentById;
const createDepartment = async (req, res) => {
    try {
        const { name, description, floor_number, phone, email, head_doctor_id } = req.body;
        if (!name) {
            throw new errors_1.AppError(400, 'Department name is required');
        }
        const result = await (0, database_1.query)(`INSERT INTO departments (name, description, floor_number, phone, email, head_doctor_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING *`, [name, description || null, floor_number || null, phone || null, email || null, head_doctor_id || null]);
        res.status(201).json({
            success: true,
            message: 'Department created successfully',
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
exports.createDepartment = createDepartment;
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, floor_number, phone, email, head_doctor_id, is_active } = req.body;
        const result = await (0, database_1.query)(`UPDATE departments SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        floor_number = COALESCE($3, floor_number),
        phone = COALESCE($4, phone),
        email = COALESCE($5, email),
        head_doctor_id = COALESCE($6, head_doctor_id),
        is_active = COALESCE($7, is_active)
       WHERE id = $8 AND deleted_at IS NULL
       RETURNING *`, [name, description, floor_number, phone, email, head_doctor_id, is_active, id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Department not found');
        }
        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
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
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, database_1.query)(`UPDATE departments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
        res.status(200).json({
            success: true,
            message: 'Department deleted successfully',
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
exports.deleteDepartment = deleteDepartment;
exports.default = {
    getDepartments: exports.getDepartments,
    getDepartmentById: exports.getDepartmentById,
    createDepartment: exports.createDepartment,
    updateDepartment: exports.updateDepartment,
    deleteDepartment: exports.deleteDepartment,
};
//# sourceMappingURL=departments.controller.js.map