"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointment = exports.updateAppointment = exports.createAppointment = exports.getAppointmentsByDoctor = exports.getAppointmentsByPatient = exports.getAppointmentById = exports.getAppointments = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const canAccessAppointment = (appointment, user) => {
    if (!user)
        return false;
    // Admin puede ver todo
    if (user.role === 'admin')
        return true;
    // Médico ve solo sus citas
    if (user.role === 'doctor') {
        return String(appointment.doctor_user_id) === String(user.id);
    }
    // Paciente solo sus citas
    if (user.role === 'patient') {
        return String(appointment.patient_user_id) === String(user.id);
    }
    return false;
};
const getAppointments = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        let sql = `
SELECT
a.id,
a.appointment_number,
a.appointment_date,
a.appointment_time,
a.status,
a.priority,
a.appointment_type,
a.chief_complaint,
p.patient_code,
p.first_name || ' ' || p.last_name as patient_name,
p.user_id as patient_user_id,
d.user_id as doctor_user_id,
d.license_number,
u.first_name || ' ' || u.last_name as doctor_name,
d.specialization,
r.room_number,
a.created_at

FROM appointments a

JOIN patients p
ON a.patient_id=p.id

JOIN doctors d
ON a.doctor_id=d.id

JOIN users u
ON d.user_id=u.id

LEFT JOIN rooms r
ON a.room_id=r.id

WHERE a.deleted_at IS NULL
`;
        const values = [];
        if (req.user.role === 'admin') {
            sql += `ORDER BY a.appointment_date DESC`;
        }
        else if (req.user.role === 'doctor') {
            sql += `AND d.user_id=$1 ORDER BY a.appointment_date DESC`;
            values.push(req.user.id);
        }
        else if (req.user.role === 'patient') {
            sql += `AND p.user_id=$1 ORDER BY a.appointment_date DESC`;
            values.push(req.user.id);
        }
        const result = await (0, database_1.query)(sql, values);
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
exports.getAppointments = getAppointments;
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT
a.*,
p.patient_code,
p.user_id as patient_user_id,
d.user_id as doctor_user_id

FROM appointments a

JOIN patients p
ON a.patient_id=p.id

JOIN doctors d
ON a.doctor_id=d.id

WHERE a.id=$1
AND a.deleted_at IS NULL`, [id]);
        if (result.rows.length === 0) {
            throw new errors_1.AppError(404, 'Appointment not found');
        }
        if (!canAccessAppointment(result.rows[0], req.user)) {
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
exports.getAppointmentById = getAppointmentById;
const getAppointmentsByPatient = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        const { patientId } = req.params;
        // Paciente solo puede ver sus propias citas
        if (req.user.role === 'patient') {
            const patientCheck = await (0, database_1.query)(`SELECT user_id FROM patients WHERE id=$1`, [patientId]);
            if (patientCheck.rows.length === 0) {
                throw new errors_1.AppError(404, 'Patient not found');
            }
            // Comparación robusta con cast a string
            if (String(patientCheck.rows[0].user_id) !== String(req.user.id)) {
                throw new errors_1.AppError(403, 'Insufficient permissions');
            }
        }
        const sql = `
SELECT
a.id,
a.appointment_number,
a.appointment_date,
a.appointment_time,
a.status,
a.priority,
a.appointment_type,
a.chief_complaint,
p.patient_code,
p.first_name || ' ' || p.last_name as patient_name,
p.user_id as patient_user_id,
d.user_id as doctor_user_id,
d.license_number,
u.first_name || ' ' || u.last_name as doctor_name,
d.specialization,
r.room_number,
a.created_at

FROM appointments a

JOIN patients p
ON a.patient_id=p.id

JOIN doctors d
ON a.doctor_id=d.id

JOIN users u
ON d.user_id=u.id

LEFT JOIN rooms r
ON a.room_id=r.id

WHERE a.deleted_at IS NULL
AND p.id=$1

ORDER BY a.appointment_date DESC
`;
        const result = await (0, database_1.query)(sql, [patientId]);
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
exports.getAppointmentsByPatient = getAppointmentsByPatient;
const getAppointmentsByDoctor = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        const { doctorId } = req.params;
        if (req.user.role === 'doctor') {
            const doctorCheck = await (0, database_1.query)(`SELECT user_id FROM doctors WHERE id=$1`, [doctorId]);
            if (doctorCheck.rows.length === 0) {
                throw new errors_1.AppError(404, 'Doctor not found');
            }
            if (String(doctorCheck.rows[0].user_id) !== String(req.user.id)) {
                throw new errors_1.AppError(403, 'Insufficient permissions');
            }
        }
        const sql = `
SELECT
a.id,
a.appointment_number,
a.appointment_date,
a.appointment_time,
a.status,
a.priority,
a.appointment_type,
a.chief_complaint,
p.patient_code,
p.first_name || ' ' || p.last_name as patient_name,
p.user_id as patient_user_id,
d.user_id as doctor_user_id,
d.license_number,
u.first_name || ' ' || u.last_name as doctor_name,
d.specialization,
r.room_number,
a.created_at

FROM appointments a

JOIN patients p
ON a.patient_id=p.id

JOIN doctors d
ON a.doctor_id=d.id

JOIN users u
ON d.user_id=u.id

LEFT JOIN rooms r
ON a.room_id=r.id

WHERE a.deleted_at IS NULL
AND d.id=$1

ORDER BY a.appointment_date DESC
`;
        const result = await (0, database_1.query)(sql, [doctorId]);
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
exports.getAppointmentsByDoctor = getAppointmentsByDoctor;
const createAppointment = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        const { patient_id, doctor_id, room_id, appointment_date, appointment_time, appointment_type, priority, chief_complaint, } = req.body;
        if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !appointment_type) {
            throw new errors_1.AppError(400, 'Missing required fields');
        }
        // Verificar que el paciente existe
        const patientResult = await (0, database_1.query)(`SELECT id, user_id FROM patients WHERE id=$1 AND deleted_at IS NULL`, [patient_id]);
        if (patientResult.rows.length === 0) {
            throw new errors_1.AppError(404, 'Patient not found');
        }
        // Para pacientes: solo pueden agendar para sí mismos
        if (req.user.role === 'patient') {
            if (String(patientResult.rows[0].user_id) !== String(req.user.id)) {
                throw new errors_1.AppError(403, 'Insufficient permissions');
            }
        }
        // Verificar que el doctor existe
        const doctorResult = await (0, database_1.query)(`SELECT id, user_id FROM doctors WHERE id=$1 AND deleted_at IS NULL`, [doctor_id]);
        if (doctorResult.rows.length === 0) {
            throw new errors_1.AppError(404, 'Doctor not found');
        }
        // Generar appointment_number
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) as count FROM appointments WHERE appointment_date=$1`, [appointment_date]);
        const count = parseInt(countResult.rows[0].count, 10);
        const appointmentNumber = `APT-${appointment_date.replace(/-/g, '')}-${String(count + 1).padStart(5, '0')}`;
        const result = await (0, database_1.query)(`INSERT INTO appointments (
patient_id,
doctor_id,
room_id,
appointment_date,
appointment_time,
appointment_type,
priority,
chief_complaint,
appointment_number,
status
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'scheduled')
RETURNING *`, [
            patient_id,
            doctor_id,
            room_id || null,
            appointment_date,
            appointment_time,
            appointment_type,
            priority || 'normal',
            chief_complaint || null,
            appointmentNumber,
        ]);
        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
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
exports.createAppointment = createAppointment;
const updateAppointment = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        const { id } = req.params;
        const { appointment_date, appointment_time, appointment_type, priority, chief_complaint, status, } = req.body;
        const appointmentResult = await (0, database_1.query)(`SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id
FROM appointments a
JOIN patients p ON a.patient_id=p.id
JOIN doctors d ON a.doctor_id=d.id
WHERE a.id=$1 AND a.deleted_at IS NULL`, [id]);
        if (appointmentResult.rows.length === 0) {
            throw new errors_1.AppError(404, 'Appointment not found');
        }
        const appointment = appointmentResult.rows[0];
        if (!canAccessAppointment(appointment, req.user)) {
            throw new errors_1.AppError(403, 'Insufficient permissions');
        }
        const result = await (0, database_1.query)(`UPDATE appointments SET
appointment_date=COALESCE($1, appointment_date),
appointment_time=COALESCE($2, appointment_time),
appointment_type=COALESCE($3, appointment_type),
priority=COALESCE($4, priority),
chief_complaint=COALESCE($5, chief_complaint),
status=COALESCE($6, status)
WHERE id=$7 AND deleted_at IS NULL
RETURNING *`, [
            appointment_date || null,
            appointment_time || null,
            appointment_type || null,
            priority || null,
            chief_complaint || null,
            status || null,
            id,
        ]);
        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
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
exports.updateAppointment = updateAppointment;
const cancelAppointment = async (req, res) => {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'No user found');
        }
        const { id } = req.params;
        const { cancellation_reason } = req.body;
        const appointmentResult = await (0, database_1.query)(`SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id
FROM appointments a
JOIN patients p ON a.patient_id=p.id
JOIN doctors d ON a.doctor_id=d.id
WHERE a.id=$1 AND a.deleted_at IS NULL`, [id]);
        if (appointmentResult.rows.length === 0) {
            throw new errors_1.AppError(404, 'Appointment not found');
        }
        const appointment = appointmentResult.rows[0];
        if (!canAccessAppointment(appointment, req.user)) {
            throw new errors_1.AppError(403, 'Insufficient permissions');
        }
        const result = await (0, database_1.query)(`UPDATE appointments SET
status='cancelled',
cancellation_reason=$1
WHERE id=$2 AND deleted_at IS NULL
RETURNING *`, [cancellation_reason || null, id]);
        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
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
exports.cancelAppointment = cancelAppointment;
exports.default = {
    getAppointments: exports.getAppointments,
    getAppointmentById: exports.getAppointmentById,
    getAppointmentsByPatient: exports.getAppointmentsByPatient,
    getAppointmentsByDoctor: exports.getAppointmentsByDoctor,
    createAppointment: exports.createAppointment,
    updateAppointment: exports.updateAppointment,
    cancelAppointment: exports.cancelAppointment,
};
//# sourceMappingURL=appointments.controller.js.map