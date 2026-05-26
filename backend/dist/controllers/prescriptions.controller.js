"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescription = exports.dispensePrescription = exports.createPrescription = exports.getPrescriptionsByPatient = exports.getPrescriptionById = exports.getPrescriptions = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const getPrescriptions = async (req, res) => {
    try {
        const result = await (0, database_1.query)(`SELECT p.id, p.prescription_number, p.prescription_date, p.diagnosis, p.is_active, p.dispensed,
              pt.first_name || ' ' || pt.last_name as patient_name,
              u.first_name || ' ' || u.last_name as doctor_name,
              p.created_at
       FROM prescriptions p
       JOIN patients pt ON p.patient_id = pt.id
       JOIN doctors d ON p.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE p.deleted_at IS NULL
       ORDER BY p.prescription_date DESC`);
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
exports.getPrescriptions = getPrescriptions;
const getPrescriptionById = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        const { id } = req.params;
        const prescription = await (0, database_1.query)(`SELECT p.*, pt.id as patient_id, pt.user_id as patient_user_id, d.user_id as doctor_user_id
       FROM prescriptions p
       JOIN patients pt ON p.patient_id = pt.id
       JOIN doctors d ON p.doctor_id = d.id
       WHERE p.id = $1 AND p.deleted_at IS NULL`, [id]);
        if (prescription.rows.length === 0) {
            throw new errors_1.AppError(404, 'Prescription not found');
        }
        const presc = prescription.rows[0];
        // Validar permisos
        if (req.user.role === 'patient' && presc.patient_user_id !== req.user.id) {
            throw new errors_1.AppError(403, 'Insufficient permissions');
        }
        const items = await (0, database_1.query)(`SELECT pi.id, pi.medication_name, pi.dosage, pi.frequency, pi.duration, pi.quantity, pi.instructions,
              inv.name as medication_full_name, inv.unit_price
       FROM prescription_items pi
       JOIN inventory inv ON pi.inventory_id = inv.id
       WHERE pi.prescription_id = $1`, [id]);
        res.status(200).json({
            success: true,
            data: {
                ...presc,
                items: items.rows,
            },
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
exports.getPrescriptionById = getPrescriptionById;
const getPrescriptionsByPatient = async (req, res) => {
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
        const result = await (0, database_1.query)(`SELECT p.id, p.prescription_number, p.prescription_date, p.is_active, p.dispensed,
              u.first_name || ' ' || u.last_name as doctor_name
       FROM prescriptions p
       JOIN doctors d ON p.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE p.patient_id = $1 AND p.deleted_at IS NULL
       ORDER BY p.prescription_date DESC`, [patientId]);
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
exports.getPrescriptionsByPatient = getPrescriptionsByPatient;
const createPrescription = async (req, res) => {
    try {
        const { patient_id, doctor_id, medical_record_id, appointment_id, diagnosis, notes, items } = req.body;
        if (!patient_id || !doctor_id) {
            throw new errors_1.AppError(400, 'Missing required fields');
        }
        // Create prescription
        const prescResult = await (0, database_1.query)(`INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, appointment_id, diagnosis, notes, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING *`, [patient_id, doctor_id, medical_record_id || null, appointment_id || null, diagnosis || null, notes || null]);
        const prescription = prescResult.rows[0];
        // Create prescription items
        if (items && items.length > 0) {
            for (const item of items) {
                await (0, database_1.query)(`INSERT INTO prescription_items (prescription_id, inventory_id, medication_name, dosage, frequency, duration, quantity, instructions)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [prescription.id, item.inventory_id, item.medication_name, item.dosage, item.frequency, item.duration, item.quantity, item.instructions || null]);
            }
        }
        res.status(201).json({
            success: true,
            message: 'Prescription created successfully',
            data: prescription,
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
exports.createPrescription = createPrescription;
const dispensePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`UPDATE prescriptions SET dispensed = TRUE, dispensed_at = CURRENT_TIMESTAMP, dispensed_by = $1
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`, [req.user?.id, id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Prescription not found');
        }
        res.status(200).json({
            success: true,
            message: 'Prescription dispensed successfully',
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
exports.dispensePrescription = dispensePrescription;
const deletePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, database_1.query)(`UPDATE prescriptions SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
        res.status(200).json({
            success: true,
            message: 'Prescription deleted successfully',
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
exports.deletePrescription = deletePrescription;
exports.default = {
    getPrescriptions: exports.getPrescriptions,
    getPrescriptionById: exports.getPrescriptionById,
    getPrescriptionsByPatient: exports.getPrescriptionsByPatient,
    createPrescription: exports.createPrescription,
    dispensePrescription: exports.dispensePrescription,
    deletePrescription: exports.deletePrescription,
};
//# sourceMappingURL=prescriptions.controller.js.map