import { Request, Response } from 'express';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';

const canAccessAppointment = (
  appointment: any,
  user: Request['user']
) => {
  if (!user) return false;

  // Admin puede ver todo
  if (user.role === 'admin') return true;

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


export const getAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
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

    const values: any[] = [];

    if (req.user.role === 'admin') {
      sql += `ORDER BY a.appointment_date DESC`;
    } else if (req.user.role === 'doctor') {
      sql += `AND d.user_id=$1 ORDER BY a.appointment_date DESC`;
      values.push(req.user.id);
    } else if (req.user.role === 'patient') {
      sql += `AND p.user_id=$1 ORDER BY a.appointment_date DESC`;
      values.push(req.user.id);
    }

    const result = await query(sql, values);

    res.status(200).json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};


export const getAppointmentById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT
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
AND a.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Appointment not found');
    }

    if (!canAccessAppointment(result.rows[0], req.user)) {
      throw new AppError(403, 'Insufficient permissions');
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};


export const getAppointmentsByPatient = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { patientId } = req.params;

    // Paciente solo puede ver sus propias citas
    if (req.user.role === 'patient') {
      const patientCheck = await query(
        `SELECT user_id FROM patients WHERE id=$1`,
        [patientId]
      );

      if (patientCheck.rows.length === 0) {
        throw new AppError(404, 'Patient not found');
      }

      // Comparación robusta con cast a string
      if (String(patientCheck.rows[0].user_id) !== String(req.user.id)) {
        throw new AppError(403, 'Insufficient permissions');
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

    const result = await query(sql, [patientId]);

    res.status(200).json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};


export const getAppointmentsByDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { doctorId } = req.params;

    if (req.user.role === 'doctor') {
      const doctorCheck = await query(
        `SELECT user_id FROM doctors WHERE id=$1`,
        [doctorId]
      );

      if (doctorCheck.rows.length === 0) {
        throw new AppError(404, 'Doctor not found');
      }

      if (String(doctorCheck.rows[0].user_id) !== String(req.user.id)) {
        throw new AppError(403, 'Insufficient permissions');
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

    const result = await query(sql, [doctorId]);

    res.status(200).json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};


export const createAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    // Solo pacientes y admin pueden crear citas, no médicos
    if (req.user.role === 'doctor') {
      throw new AppError(403, 'Doctors cannot create appointments');
    }

    const {
      patient_id,
      doctor_id,
      room_id,
      appointment_date,
      appointment_time,
      appointment_type,
      priority,
      chief_complaint,
    } = req.body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !appointment_type) {
      throw new AppError(400, 'Missing required fields');
    }

    // Verificar que el paciente existe
    const patientResult = await query(
      `SELECT id, user_id FROM patients WHERE id=$1 AND deleted_at IS NULL`,
      [patient_id]
    );

    if (patientResult.rows.length === 0) {
      throw new AppError(404, 'Patient not found');
    }

    // Para pacientes: solo pueden agendar para sí mismos
    if (req.user.role === 'patient') {
      if (String(patientResult.rows[0].user_id) !== String(req.user.id)) {
        throw new AppError(403, 'Insufficient permissions');
      }
    }

    // Verificar que el doctor existe
    const doctorResult = await query(
      `SELECT id, user_id FROM doctors WHERE id=$1 AND deleted_at IS NULL`,
      [doctor_id]
    );

    if (doctorResult.rows.length === 0) {
      throw new AppError(404, 'Doctor not found');
    }

    // Validar que el paciente no tenga otra cita a la misma hora
    const patientConflict = await query(
      `SELECT id FROM appointments 
       WHERE patient_id=$1 
       AND appointment_date=$2 
       AND appointment_time=$3 
       AND status != 'cancelled'
       AND deleted_at IS NULL`,
      [patient_id, appointment_date, appointment_time]
    );

    if (patientConflict.rows.length > 0) {
      throw new AppError(409, 'Patient already has an appointment at this time');
    }

    // Validar que el doctor no tenga otra cita a la misma hora
    const doctorConflict = await query(
      `SELECT id FROM appointments 
       WHERE doctor_id=$1 
       AND appointment_date=$2 
       AND appointment_time=$3 
       AND status != 'cancelled'
       AND deleted_at IS NULL`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (doctorConflict.rows.length > 0) {
      throw new AppError(409, 'Doctor already has an appointment at this time');
    }

    // Generar appointment_number
    const countResult = await query(
      `SELECT COUNT(*) as count FROM appointments WHERE appointment_date=$1`,
      [appointment_date]
    );

    const count = parseInt(countResult.rows[0].count, 10);
    const appointmentNumber = `APT-${appointment_date.replace(/-/g, '')}-${String(count + 1).padStart(5, '0')}`;

    const result = await query(
      `INSERT INTO appointments (
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
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
RETURNING *`,
      [
        patient_id,
        doctor_id,
        room_id || null,
        appointment_date,
        appointment_time,
        appointment_type,
        priority || 'normal',
        chief_complaint || null,
        appointmentNumber,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};


export const updateAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;

    const {
      appointment_date,
      appointment_time,
      appointment_type,
      priority,
      chief_complaint,
      status,
    } = req.body;

    const appointmentResult = await query(
      `SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id
FROM appointments a
JOIN patients p ON a.patient_id=p.id
JOIN doctors d ON a.doctor_id=d.id
WHERE a.id=$1 AND a.deleted_at IS NULL`,
      [id]
    );

    if (appointmentResult.rows.length === 0) {
      throw new AppError(404, 'Appointment not found');
    }

    const appointment = appointmentResult.rows[0];

    if (!canAccessAppointment(appointment, req.user)) {
      throw new AppError(403, 'Insufficient permissions');
    }

    // Si se está cambiando la fecha o hora, validar conflictos
    if (appointment_date || appointment_time) {
      const newDate = appointment_date || appointment.appointment_date;
      const newTime = appointment_time || appointment.appointment_time;

      // Validar que el paciente no tenga otra cita a la misma hora
      const patientConflict = await query(
        `SELECT id FROM appointments 
         WHERE patient_id=$1 
         AND appointment_date=$2 
         AND appointment_time=$3 
         AND id != $4
         AND status != 'cancelled'
         AND deleted_at IS NULL`,
        [appointment.patient_id, newDate, newTime, id]
      );

      if (patientConflict.rows.length > 0) {
        throw new AppError(409, 'Patient already has an appointment at this time');
      }

      // Validar que el doctor no tenga otra cita a la misma hora
      const doctorConflict = await query(
        `SELECT id FROM appointments 
         WHERE doctor_id=$1 
         AND appointment_date=$2 
         AND appointment_time=$3 
         AND id != $4
         AND status != 'cancelled'
         AND deleted_at IS NULL`,
        [appointment.doctor_id, newDate, newTime, id]
      );

      if (doctorConflict.rows.length > 0) {
        throw new AppError(409, 'Doctor already has an appointment at this time');
      }
    }

    const result = await query(
      `UPDATE appointments SET
appointment_date=COALESCE($1, appointment_date),
appointment_time=COALESCE($2, appointment_time),
appointment_type=COALESCE($3, appointment_type),
priority=COALESCE($4, priority),
chief_complaint=COALESCE($5, chief_complaint),
status=COALESCE($6, status)
WHERE id=$7 AND deleted_at IS NULL
RETURNING *`,
      [
        appointment_date || null,
        appointment_time || null,
        appointment_type || null,
        priority || null,
        chief_complaint || null,
        status || null,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};


export const cancelAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;
    const { cancellation_reason } = req.body;

    const appointmentResult = await query(
      `SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id
FROM appointments a
JOIN patients p ON a.patient_id=p.id
JOIN doctors d ON a.doctor_id=d.id
WHERE a.id=$1 AND a.deleted_at IS NULL`,
      [id]
    );

    if (appointmentResult.rows.length === 0) {
      throw new AppError(404, 'Appointment not found');
    }

    const appointment = appointmentResult.rows[0];

    if (!canAccessAppointment(appointment, req.user)) {
      throw new AppError(403, 'Insufficient permissions');
    }

    const result = await query(
      `UPDATE appointments SET
status='cancelled',
cancellation_reason=$1
WHERE id=$2 AND deleted_at IS NULL
RETURNING *`,
      [cancellation_reason || null, id]
    );

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: result.rows[0],
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};


export const markAppointmentAsAttended = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;

    const appointmentResult = await query(
      `SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id
FROM appointments a
JOIN patients p ON a.patient_id=p.id
JOIN doctors d ON a.doctor_id=d.id
WHERE a.id=$1 AND a.deleted_at IS NULL`,
      [id]
    );

    if (appointmentResult.rows.length === 0) {
      throw new AppError(404, 'Appointment not found');
    }

    const appointment = appointmentResult.rows[0];

    // Solo el doctor o admin pueden marcar como atendido
    if (req.user.role !== 'admin' && !(req.user.role === 'doctor' && String(appointment.doctor_user_id) === String(req.user.id))) {
      throw new AppError(403, 'Insufficient permissions');
    }

    const result = await query(
      `UPDATE appointments SET
status='in_progress'
WHERE id=$1 AND deleted_at IS NULL
RETURNING *`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Appointment marked as attended',
      data: result.rows[0],
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};


export const markAppointmentAsCompleted = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;
    const { diagnosis, notes } = req.body;

    const appointmentResult = await query(
      `SELECT a.*, p.user_id as patient_user_id, d.user_id as doctor_user_id
FROM appointments a
JOIN patients p ON a.patient_id=p.id
JOIN doctors d ON a.doctor_id=d.id
WHERE a.id=$1 AND a.deleted_at IS NULL`,
      [id]
    );

    if (appointmentResult.rows.length === 0) {
      throw new AppError(404, 'Appointment not found');
    }

    const appointment = appointmentResult.rows[0];

    // Solo el doctor o admin pueden marcar como completado
    if (req.user.role !== 'admin' && !(req.user.role === 'doctor' && String(appointment.doctor_user_id) === String(req.user.id))) {
      throw new AppError(403, 'Insufficient permissions');
    }

    const result = await query(
      `UPDATE appointments SET
status='completed',
diagnosis=$1,
notes=$2
WHERE id=$3 AND deleted_at IS NULL
RETURNING *`,
      [diagnosis || null, notes || null, id]
    );

    res.status(200).json({
      success: true,
      message: 'Appointment marked as completed',
      data: result.rows[0],
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};


export default {
  getAppointments,
  getAppointmentById,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  markAppointmentAsAttended,
  markAppointmentAsCompleted,
};
