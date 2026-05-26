import { Request, Response } from 'express';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';

export const getPatients = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT p.id, p.patient_code, p.first_name, p.last_name, p.date_of_birth, p.gender, p.blood_type,
              p.phone, p.email, p.insurance_provider, p.is_active, p.user_id, p.created_at
       FROM patients p
       WHERE p.deleted_at IS NULL
       ORDER BY p.created_at DESC`
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

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM patients WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Patient not found');
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

// GET /patients/me — paciente ve su propio perfil, admin/doctor también puede consultar
export const getCurrentPatient = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const result = await query(
      `SELECT * FROM patients
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Patient profile not found');
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

export const createPatient = async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      blood_type,
      phone,
      email,
      address,
      city,
      state,
      postal_code,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relationship,
      insurance_provider,
      insurance_policy_number,
    } = req.body;

    if (!first_name || !last_name || !date_of_birth || !gender || !phone || !address) {
      throw new AppError(400, 'Missing required fields');
    }

    const result = await query(
      `INSERT INTO patients (
        user_id, first_name, last_name, date_of_birth, gender, blood_type,
        phone, email, address, city, state, postal_code,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        insurance_provider, insurance_policy_number, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, TRUE)
      RETURNING *`,
      [
        user_id || null,
        first_name,
        last_name,
        date_of_birth,
        gender,
        blood_type || null,
        phone,
        email || null,
        address,
        city || null,
        state || null,
        postal_code || null,
        emergency_contact_name || null,
        emergency_contact_phone || null,
        emergency_contact_relationship || null,
        insurance_provider || null,
        insurance_policy_number || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
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

// PUT /patients/me — solo el paciente actualiza su propio perfil
export const updateCurrentPatient = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { first_name, last_name, phone, email, address, insurance_provider, height_cm, weight_kg, allergies } = req.body;

    const result = await query(
      `UPDATE patients SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        address = COALESCE($5, address),
        insurance_provider = COALESCE($6, insurance_provider),
        height_cm = COALESCE($7, height_cm),
        weight_kg = COALESCE($8, weight_kg),
        allergies = COALESCE($9, allergies)
       WHERE user_id = $10 AND deleted_at IS NULL
       RETURNING *`,
      [first_name, last_name, phone, email, address, insurance_provider, height_cm, weight_kg, allergies, req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Patient profile not found');
    }

    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully',
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

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, email, address, insurance_provider, height_cm, weight_kg, allergies } = req.body;

    const result = await query(
      `UPDATE patients SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        address = COALESCE($5, address),
        insurance_provider = COALESCE($6, insurance_provider),
        height_cm = COALESCE($7, height_cm),
        weight_kg = COALESCE($8, weight_kg),
        allergies = COALESCE($9, allergies)
       WHERE id = $10 AND deleted_at IS NULL
       RETURNING *`,
      [first_name, last_name, phone, email, address, insurance_provider, height_cm, weight_kg, allergies, id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Patient not found');
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
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

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await query(
      `UPDATE patients SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
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
  getPatients,
  getPatientById,
  getCurrentPatient,
  createPatient,
  updateCurrentPatient,
  updatePatient,
  deletePatient,
};
