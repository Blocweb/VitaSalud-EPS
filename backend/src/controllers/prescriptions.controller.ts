import { Request, Response } from 'express';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';

export const getPrescriptions = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT p.id, p.prescription_number, p.prescription_date, p.diagnosis, p.is_active, p.dispensed,
              pt.first_name || ' ' || pt.last_name as patient_name,
              u.first_name || ' ' || u.last_name as doctor_name,
              p.created_at
       FROM prescriptions p
       JOIN patients pt ON p.patient_id = pt.id
       JOIN doctors d ON p.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE p.deleted_at IS NULL
       ORDER BY p.prescription_date DESC`
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

export const getPrescriptionById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;

    const prescription = await query(
      `SELECT p.*, pt.id as patient_id, pt.user_id as patient_user_id, d.user_id as doctor_user_id
       FROM prescriptions p
       JOIN patients pt ON p.patient_id = pt.id
       JOIN doctors d ON p.doctor_id = d.id
       WHERE p.id = $1 AND p.deleted_at IS NULL`,
      [id]
    );

    if (prescription.rows.length === 0) {
      throw new AppError(404, 'Prescription not found');
    }

    const presc = prescription.rows[0];

    // Validar permisos
    if (req.user.role === 'patient' && presc.patient_user_id !== req.user.id) {
      throw new AppError(403, 'Insufficient permissions');
    }

    const items = await query(
      `SELECT pi.id, pi.medication_name, pi.dosage, pi.frequency, pi.duration, pi.quantity, pi.instructions,
              inv.name as medication_full_name, inv.unit_price
       FROM prescription_items pi
       JOIN inventory inv ON pi.inventory_id = inv.id
       WHERE pi.prescription_id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...presc,
        items: items.rows,
      },
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};

export const getPrescriptionsByPatient = async (req: Request, res: Response) => {
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
      if (patientCheck.rows[0].user_id !== req.user.id) {
        throw new AppError(403, 'Insufficient permissions');
      }
    }

    const result = await query(
      `SELECT p.id, p.prescription_number, p.prescription_date, p.is_active, p.dispensed,
              u.first_name || ' ' || u.last_name as doctor_name
       FROM prescriptions p
       JOIN doctors d ON p.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE p.patient_id = $1 AND p.deleted_at IS NULL
       ORDER BY p.prescription_date DESC`,
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

export const getPrescriptionsByDoctor = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { doctorId } = req.params;

    // Verificar que el doctor existe
    const doctorCheck = await query(
      `SELECT id, user_id FROM doctors WHERE id = $1 AND deleted_at IS NULL`,
      [doctorId]
    );

    if (doctorCheck.rows.length === 0) {
      throw new AppError(404, 'Doctor not found');
    }

    // Validar permisos: un doctor solo puede ver sus propias recetas
    if (req.user.role === 'doctor' && doctorCheck.rows[0].user_id !== req.user.id) {
      throw new AppError(403, 'Insufficient permissions');
    }

    const result = await query(
      `SELECT p.id, p.prescription_number, p.prescription_date, p.diagnosis, p.is_active, p.dispensed,
              pt.first_name || ' ' || pt.last_name as patient_name,
              u.first_name || ' ' || u.last_name as doctor_name,
              p.created_at
       FROM prescriptions p
       JOIN patients pt ON p.patient_id = pt.id
       JOIN doctors d ON p.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE p.doctor_id = $1 AND p.deleted_at IS NULL
       ORDER BY p.prescription_date DESC`,
      [doctorId]
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

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const { patient_id, doctor_id, medical_record_id, appointment_id, diagnosis, notes, items } = req.body;

    if (!patient_id || !doctor_id) {
      throw new AppError(400, 'Missing required fields');
    }

    // Create prescription
    const prescResult = await query(
      `INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, appointment_id, diagnosis, notes, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING *`,
      [patient_id, doctor_id, medical_record_id || null, appointment_id || null, diagnosis || null, notes || null]
    );

    const prescription = prescResult.rows[0];

    // Create prescription items
    if (items && items.length > 0) {
      for (const item of items) {
        await query(
          `INSERT INTO prescription_items (prescription_id, inventory_id, medication_name, dosage, frequency, duration, quantity, instructions)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [prescription.id, item.inventory_id, item.medication_name, item.dosage, item.frequency, item.duration, item.quantity, item.instructions || null]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription,
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};

export const dispensePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE prescriptions SET dispensed = TRUE, dispensed_at = CURRENT_TIMESTAMP, dispensed_by = $1
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`,
      [req.user?.id, id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Prescription not found');
    }

    res.status(200).json({
      success: true,
      message: 'Prescription dispensed successfully',
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

export const deletePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await query(
      `UPDATE prescriptions SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully',
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
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  createPrescription,
  dispensePrescription,
  deletePrescription,
};
