"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLabTest = exports.updateLabTestStatus = exports.updateLabTestResults = exports.createLabTest = exports.getLabTestsByPatient = exports.getLabTestById = exports.getLabTests = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const getLabTests = async (req, res) => {
    try {
        const result = await (0, database_1.query)(`SELECT l.id, l.test_number, l.test_name, l.test_type, l.test_date, l.status, l.priority,
              p.first_name || ' ' || p.last_name as patient_name,
              u.first_name || ' ' || u.last_name as doctor_name,
              l.created_at
       FROM lab_tests l
       JOIN patients p ON l.patient_id = p.id
       JOIN doctors d ON l.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE l.deleted_at IS NULL
       ORDER BY l.test_date DESC`);
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
exports.getLabTests = getLabTests;
const getLabTestById = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT l.*, p.id as patient_id, p.user_id as patient_user_id FROM lab_tests l
       JOIN patients p ON l.patient_id = p.id
       WHERE l.id = $1 AND l.deleted_at IS NULL`, [id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Lab test not found');
        }
        // Validar permisos
        if (req.user.role === 'patient' && result.rows[0].patient_user_id !== req.user.id) {
            throw new errors_1.AppError(403, 'Insufficient permissions');
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
exports.getLabTestById = getLabTestById;
const getLabTestsByPatient = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        const { patientId } = req.params;
        // Verificar que el paciente existe
        const patientCheck = await (0, database_1.query)(`SELECT id, user_id FROM patients WHERE id = $1 AND deleted_at IS NULL`, [patientId]);
        if (patientCheck.rows.length === 0) {
            throw new errors_1.AppError(404, 'Patient not found');
        }
        // Validar permisos
        if (req.user.role === 'patient') {
            if (patientCheck.rows[0].user_id !== req.user.id) {
                throw new errors_1.AppError(403, 'Insufficient permissions');
            }
        }
        const result = await (0, database_1.query)(`SELECT l.id, l.test_number, l.test_name, l.test_type, l.test_date, l.status, l.priority, l.results_available_at
       FROM lab_tests l
       WHERE l.patient_id = $1 AND l.deleted_at IS NULL
       ORDER BY l.test_date DESC`, [patientId]);
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
exports.getLabTestsByPatient = getLabTestsByPatient;
const createLabTest = async (req, res) => {
    try {
        const { patient_id, doctor_id, medical_record_id, test_name, test_type, test_date, scheduled_time, sample_type, cost } = req.body;
        if (!patient_id || !doctor_id || !test_name || !test_type || !test_date) {
            throw new errors_1.AppError(400, 'Missing required fields');
        }
        const result = await (0, database_1.query)(`INSERT INTO lab_tests (patient_id, doctor_id, medical_record_id, test_name, test_type, test_date, scheduled_time, sample_type, status, cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)
       RETURNING *`, [patient_id, doctor_id, medical_record_id || null, test_name, test_type, test_date, scheduled_time || null, sample_type || null, cost || 0]);
        res.status(201).json({
            success: true,
            message: 'Lab test created successfully',
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
exports.createLabTest = createLabTest;
const updateLabTestResults = async (req, res) => {
    try {
        const { id } = req.params;
        const { results, results_summary, abnormal_findings, reference_ranges, performed_by, verified_by } = req.body;
        const result = await (0, database_1.query)(`UPDATE lab_tests SET 
        results = $1,
        results_summary = $2,
        abnormal_findings = $3,
        reference_ranges = $4,
        performed_by = $5,
        verified_by = $6,
        status = 'completed',
        results_available_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND deleted_at IS NULL
       RETURNING *`, [
            results ? JSON.stringify(results) : null,
            results_summary || null,
            abnormal_findings || null,
            reference_ranges ? JSON.stringify(reference_ranges) : null,
            performed_by || null,
            verified_by || null,
            id,
        ]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Lab test not found');
        }
        res.status(200).json({
            success: true,
            message: 'Lab test results updated successfully',
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
exports.updateLabTestResults = updateLabTestResults;
const updateLabTestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            throw new errors_1.AppError(400, 'Status is required');
        }
        const result = await (0, database_1.query)(`UPDATE lab_tests SET status = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *`, [status, id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Lab test not found');
        }
        res.status(200).json({
            success: true,
            message: 'Lab test status updated successfully',
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
exports.updateLabTestStatus = updateLabTestStatus;
const deleteLabTest = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, database_1.query)(`UPDATE lab_tests SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
        res.status(200).json({
            success: true,
            message: 'Lab test deleted successfully',
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
exports.deleteLabTest = deleteLabTest;
exports.default = {
    getLabTests: exports.getLabTests,
    getLabTestById: exports.getLabTestById,
    getLabTestsByPatient: exports.getLabTestsByPatient,
    createLabTest: exports.createLabTest,
    updateLabTestResults: exports.updateLabTestResults,
    updateLabTestStatus: exports.updateLabTestStatus,
    deleteLabTest: exports.deleteLabTest,
};
//# sourceMappingURL=lab-tests.controller.js.map