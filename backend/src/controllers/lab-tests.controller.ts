import { Request, Response } from 'express';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';

export const getLabTests = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT l.id, l.test_number, l.test_name, l.test_type, l.test_date, l.status, l.priority,
              p.first_name || ' ' || p.last_name as patient_name,
              u.first_name || ' ' || u.last_name as doctor_name,
              l.created_at
       FROM lab_tests l
       JOIN patients p ON l.patient_id = p.id
       JOIN doctors d ON l.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE l.deleted_at IS NULL
       ORDER BY l.test_date DESC`
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

export const getLabTestById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;

    const result = await query(
      `SELECT l.*, p.id as patient_id, p.user_id as patient_user_id FROM lab_tests l
       JOIN patients p ON l.patient_id = p.id
       WHERE l.id = $1 AND l.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Lab test not found');
    }

    // Validar permisos
    if (req.user.role === 'patient' && result.rows[0].patient_user_id !== req.user.id) {
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

export const getLabTestsByPatient = async (req: Request, res: Response) => {
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
      `SELECT l.id, l.test_number, l.test_name, l.test_type, l.test_date, l.status, l.priority, l.results_available_at
       FROM lab_tests l
       WHERE l.patient_id = $1 AND l.deleted_at IS NULL
       ORDER BY l.test_date DESC`,
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

export const createLabTest = async (req: Request, res: Response) => {
  try {
    const { patient_id, doctor_id, medical_record_id, test_name, test_type, test_date, scheduled_time, sample_type, cost } = req.body;

    if (!patient_id || !doctor_id || !test_name || !test_type || !test_date) {
      throw new AppError(400, 'Missing required fields');
    }

    const result = await query(
      `INSERT INTO lab_tests (patient_id, doctor_id, medical_record_id, test_name, test_type, test_date, scheduled_time, sample_type, status, cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)
       RETURNING *`,
      [patient_id, doctor_id, medical_record_id || null, test_name, test_type, test_date, scheduled_time || null, sample_type || null, cost || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Lab test created successfully',
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

export const updateLabTestResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { results, results_summary, abnormal_findings, reference_ranges, performed_by, verified_by } = req.body;

    const result = await query(
      `UPDATE lab_tests SET 
        results = $1,
        results_summary = $2,
        abnormal_findings = $3,
        reference_ranges = $4,
        performed_by = $5,
        verified_by = $6,
        status = 'completed',
        results_available_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND deleted_at IS NULL
       RETURNING *`,
      [
        results ? JSON.stringify(results) : null,
        results_summary || null,
        abnormal_findings || null,
        reference_ranges ? JSON.stringify(reference_ranges) : null,
        performed_by || null,
        verified_by || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Lab test not found');
    }

    res.status(200).json({
      success: true,
      message: 'Lab test results updated successfully',
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

export const updateLabTestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new AppError(400, 'Status is required');
    }

    const result = await query(
      `UPDATE lab_tests SET status = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Lab test not found');
    }

    res.status(200).json({
      success: true,
      message: 'Lab test status updated successfully',
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

export const deleteLabTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await query(
      `UPDATE lab_tests SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Lab test deleted successfully',
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
  getLabTests,
  getLabTestById,
  getLabTestsByPatient,
  createLabTest,
  updateLabTestResults,
  updateLabTestStatus,
  deleteLabTest,
};
