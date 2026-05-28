import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';
import { getClient } from '../config/database';
import { hashPassword } from '../utils/password';

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

export const createDoctor = async (req: Request, res: Response) => {
  let client: PoolClient | undefined;

  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      department_id,
      license_number,
      specialization,
      qualification,
      experience_years,
      consultation_fee,
      available_for_emergency,
      biography,
      languages_spoken,
    } = req.body;

    if (!email || !password || !first_name || !last_name || !license_number || !specialization) {
      throw new AppError(400, 'Missing required fields');
    }

    client = await getClient();
    await client.query('BEGIN');

    const existingUser = await client.query(`SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL`, [email]);
    if (existingUser.rows.length > 0) {
      throw new AppError(409, 'Email already registered');
    }

    const existingLicense = await client.query(
      `SELECT id FROM doctors WHERE license_number = $1 AND deleted_at IS NULL`,
      [license_number]
    );
    if (existingLicense.rows.length > 0) {
      throw new AppError(409, 'License number already registered');
    }

    const roleResult = await client.query(`SELECT id FROM roles WHERE name = 'doctor' LIMIT 1`);
    const roleId = roleResult.rows[0]?.id;
    if (!roleId) {
      throw new AppError(500, 'Doctor role is not configured');
    }

    const passwordHash = await hashPassword(password);

    const usernameBase = String(email).split('@')[0];
    const userResult = await client.query(
      `INSERT INTO users (username, email, password_hash, role_id, status, first_name, last_name, phone, email_verified)
       VALUES ($1, $2, $3, $4, 'active', $5, $6, $7, TRUE)
       RETURNING id, email, first_name, last_name`,
      [usernameBase, email, passwordHash, roleId, first_name, last_name, phone || null]
    );
    const newUser = userResult.rows[0];

    const doctorResult = await client.query(
      `INSERT INTO doctors (
         user_id, department_id, license_number, specialization, qualification,
         experience_years, consultation_fee, available_for_emergency, biography, languages_spoken
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        newUser.id,
        department_id ?? null,
        license_number,
        specialization,
        qualification ?? null,
        experience_years ?? 0,
        consultation_fee ?? 0,
        available_for_emergency ?? true,
        biography ?? null,
        languages_spoken ?? null,
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: {
        ...doctorResult.rows[0],
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch(() => undefined);
    }
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  } finally {
    client?.release();
  }
};

export default {
  getDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  createDoctor,
  updateDoctor,
};
