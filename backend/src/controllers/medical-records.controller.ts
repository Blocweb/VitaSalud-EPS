import { Request, Response } from 'express';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';

const canAccessMedicalRecord = (
  record: any,
  user: Request['user']
) => {
  if (!user) return false;

  // Admin ve todo
  if (user.role === 'admin') {
    return true;
  }

  // Doctor ve registros de sus pacientes
  if (user.role === 'doctor') {
    return String(record.doctor_user_id) === String(user.id);
  }

  // Paciente ve solo sus registros
  if (user.role === 'patient') {
    return String(record.patient_user_id) === String(user.id);
  }

  return false;
};

export const getMedicalRecords = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    let sql = `
      SELECT m.id, m.record_number, m.visit_date, m.diagnosis, m.is_confidential,
              p.id as patient_id, p.user_id as patient_user_id,
              p.first_name || ' ' || p.last_name as patient_name,
              d.id as doctor_id, d.user_id as doctor_user_id,
              u.first_name || ' ' || u.last_name as doctor_name,
              m.created_at
       FROM medical_records m
       JOIN patients p ON m.patient_id = p.id
       JOIN doctors d ON m.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE m.deleted_at IS NULL
    `;

    const values: any[] = [];

    if (req.user.role === 'admin') {
      // Admin ve todo
      sql += `ORDER BY m.visit_date DESC`;
    } else if (req.user.role === 'doctor') {
      // Doctor ve solo sus registros
      sql += `AND d.user_id = $1 ORDER BY m.visit_date DESC`;
      values.push(req.user.id);
    } else if (req.user.role === 'patient') {
      // Paciente ve solo sus registros
      sql += `AND p.user_id = $1 ORDER BY m.visit_date DESC`;
      values.push(req.user.id);
    } else {
      throw new AppError(403, 'Insufficient permissions');
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

export const getMedicalRecordById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;

    const result = await query(
      `SELECT m.*, p.id as patient_id, p.user_id as patient_user_id,
              p.first_name || ' ' || p.last_name as patient_name,
              d.id as doctor_id, d.user_id as doctor_user_id,
              u.first_name || ' ' || u.last_name as doctor_name,
              d.specialization
       FROM medical_records m
       JOIN patients p ON m.patient_id = p.id
       JOIN doctors d ON m.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE m.id = $1 AND m.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Medical record not found');
    }

    if (!canAccessMedicalRecord(result.rows[0], req.user)) {
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

export const getMedicalRecordsByPatient = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { patientId } = req.params;

    // Verificar que el paciente existe
    const patientCheck = await query(
      `SELECT id, user_id FROM patients WHERE id = $1 AND deleted_at IS NULL`,
      [patientId]
    );

    if (patientCheck.rows.length === 0) {
      throw new AppError(404, 'Patient not found');
    }

    // Validar permisos
    if (req.user.role === 'patient') {
      if (String(patientCheck.rows[0].user_id) !== String(req.user.id)) {
        throw new AppError(403, 'Insufficient permissions');
      }
    }

    const result = await query(
      `SELECT m.id, m.record_number, m.visit_date, m.diagnosis, m.symptoms,
              m.treatment_plan, m.doctor_notes, m.vital_signs,
              d.id as doctor_id, d.user_id as doctor_user_id,
              u.first_name || ' ' || u.last_name as doctor_name,
              d.specialization
       FROM medical_records m
       JOIN doctors d ON m.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE m.patient_id = $1 AND m.deleted_at IS NULL
       ORDER BY m.visit_date DESC`,
      [patientId]
    );

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

export const createMedicalRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { patient_id, doctor_id, appointment_id, diagnosis, symptoms, treatment_plan, doctor_notes, vital_signs } = req.body;

    if (!patient_id || !doctor_id || !diagnosis) {
      throw new AppError(400, 'Missing required fields');
    }

    // Validar que el doctor existe
    const doctorCheck = await query(
      `SELECT id, user_id FROM doctors WHERE id = $1 AND deleted_at IS NULL`,
      [doctor_id]
    );

    if (doctorCheck.rows.length === 0) {
      throw new AppError(404, 'Doctor not found');
    }

    // Para doctores, validar que es su paciente
    if (req.user.role === 'doctor') {
      if (doctorCheck.rows[0].user_id !== req.user.id) {
        throw new AppError(403, 'Insufficient permissions');
      }
    }

    const result = await query(
      `INSERT INTO medical_records (
        patient_id, doctor_id, appointment_id, diagnosis, symptoms, 
        treatment_plan, doctor_notes, vital_signs, visit_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        patient_id,
        doctor_id,
        appointment_id || null,
        diagnosis,
        symptoms || null,
        treatment_plan || null,
        doctor_notes || null,
        vital_signs ? JSON.stringify(vital_signs) : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
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

export const updateMedicalRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;
    const { diagnosis, symptoms, treatment_plan, doctor_notes, vital_signs } = req.body;

    // Obtener registro actual para validar permisos
    const currentRecord = await query(
      `SELECT m.*, d.user_id as doctor_user_id FROM medical_records m
       JOIN doctors d ON m.doctor_id = d.id
       WHERE m.id = $1 AND m.deleted_at IS NULL`,
      [id]
    );

    if (currentRecord.rows.length === 0) {
      throw new AppError(404, 'Medical record not found');
    }

    // Validar permisos
    if (req.user.role === 'doctor' && currentRecord.rows[0].doctor_user_id !== req.user.id) {
      throw new AppError(403, 'Insufficient permissions');
    }

    const result = await query(
      `UPDATE medical_records SET 
        diagnosis = COALESCE($1, diagnosis),
        symptoms = COALESCE($2, symptoms),
        treatment_plan = COALESCE($3, treatment_plan),
        doctor_notes = COALESCE($4, doctor_notes),
        vital_signs = COALESCE($5, vital_signs)
       WHERE id = $6 AND deleted_at IS NULL
       RETURNING *`,
      [diagnosis, symptoms, treatment_plan, doctor_notes, vital_signs ? JSON.stringify(vital_signs) : null, id]
    );

    res.status(200).json({
      success: true,
      message: 'Medical record updated successfully',
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

export const deleteMedicalRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;

    // Validar que es admin
    if (req.user.role !== 'admin') {
      throw new AppError(403, 'Insufficient permissions');
    }

    await query(
      `UPDATE medical_records SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully',
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
  getMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordsByPatient,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
};
