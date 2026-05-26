import { Request, Response } from 'express';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT d.id, d.user_id, d.license_number, d.specialization, d.qualification, d.experience_years,
              d.consultation_fee, d.rating, d.total_reviews, d.available_for_emergency,
              u.first_name, u.last_name, u.email, u.phone,
              dep.name as department_name
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.deleted_at IS NULL
       ORDER BY d.rating DESC`
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

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT d.*, u.first_name, u.last_name, u.email, u.phone, dep.name as department_name
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.id = $1 AND d.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Doctor not found');
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

export const getDoctorsBySpecialization = async (req: Request, res: Response) => {
  try {
    const { specialization } = req.params;

    const result = await query(
      `SELECT d.id, d.license_number, d.specialization, d.consultation_fee, d.rating,
              u.first_name, u.last_name, u.email, dep.name as department_name
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.specialization ILIKE $1 AND d.deleted_at IS NULL
       ORDER BY d.rating DESC`,
      [`%${specialization}%`]
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

export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { department_id, consultation_fee, biography, languages_spoken } = req.body;

    const result = await query(
      `UPDATE doctors SET 
        department_id = COALESCE($1, department_id),
        consultation_fee = COALESCE($2, consultation_fee),
        biography = COALESCE($3, biography),
        languages_spoken = COALESCE($4, languages_spoken)
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING *`,
      [department_id, consultation_fee, biography, languages_spoken, id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Doctor not found');
    }

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
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
  getDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  updateDoctor,
};
