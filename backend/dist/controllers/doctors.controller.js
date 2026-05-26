"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDoctor = exports.getDoctorsBySpecialization = exports.getDoctorById = exports.getDoctors = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const getDoctors = async (req, res) => {
    try {
        const result = await (0, database_1.query)(`SELECT d.id, d.user_id, d.license_number, d.specialization, d.qualification, d.experience_years,
              d.consultation_fee, d.rating, d.total_reviews, d.available_for_emergency,
              u.first_name, u.last_name, u.email, u.phone,
              dep.name as department_name
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.deleted_at IS NULL
       ORDER BY d.rating DESC`);
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
exports.getDoctors = getDoctors;
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT d.*, u.first_name, u.last_name, u.email, u.phone, dep.name as department_name
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.id = $1 AND d.deleted_at IS NULL`, [id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Doctor not found');
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
exports.getDoctorById = getDoctorById;
const getDoctorsBySpecialization = async (req, res) => {
    try {
        const { specialization } = req.params;
        const result = await (0, database_1.query)(`SELECT d.id, d.license_number, d.specialization, d.consultation_fee, d.rating,
              u.first_name, u.last_name, u.email, dep.name as department_name
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.specialization ILIKE $1 AND d.deleted_at IS NULL
       ORDER BY d.rating DESC`, [`%${specialization}%`]);
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
exports.getDoctorsBySpecialization = getDoctorsBySpecialization;
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { department_id, consultation_fee, biography, languages_spoken } = req.body;
        const result = await (0, database_1.query)(`UPDATE doctors SET 
        department_id = COALESCE($1, department_id),
        consultation_fee = COALESCE($2, consultation_fee),
        biography = COALESCE($3, biography),
        languages_spoken = COALESCE($4, languages_spoken)
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING *`, [department_id, consultation_fee, biography, languages_spoken, id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Doctor not found');
        }
        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
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
exports.updateDoctor = updateDoctor;
exports.default = {
    getDoctors: exports.getDoctors,
    getDoctorById: exports.getDoctorById,
    getDoctorsBySpecialization: exports.getDoctorsBySpecialization,
    updateDoctor: exports.updateDoctor,
};
//# sourceMappingURL=doctors.controller.js.map