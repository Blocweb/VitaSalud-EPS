import { Request, Response } from 'express';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT d.*, u.first_name || ' ' || u.last_name as head_doctor_name
       FROM departments d
       LEFT JOIN users u ON d.head_doctor_id = u.id
       WHERE d.deleted_at IS NULL
       ORDER BY d.name`
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

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT d.*, u.first_name || ' ' || u.last_name as head_doctor_name
       FROM departments d
       LEFT JOIN users u ON d.head_doctor_id = u.id
       WHERE d.id = $1 AND d.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Department not found');
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

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, description, floor_number, phone, email, head_doctor_id } = req.body;

    if (!name) {
      throw new AppError(400, 'Department name is required');
    }

    const result = await query(
      `INSERT INTO departments (name, description, floor_number, phone, email, head_doctor_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING *`,
      [name, description || null, floor_number || null, phone || null, email || null, head_doctor_id || null]
    );

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
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

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, floor_number, phone, email, head_doctor_id, is_active } = req.body;

    const result = await query(
      `UPDATE departments SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        floor_number = COALESCE($3, floor_number),
        phone = COALESCE($4, phone),
        email = COALESCE($5, email),
        head_doctor_id = COALESCE($6, head_doctor_id),
        is_active = COALESCE($7, is_active)
       WHERE id = $8 AND deleted_at IS NULL
       RETURNING *`,
      [name, description, floor_number, phone, email, head_doctor_id, is_active, id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Department not found');
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
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

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await query(
      `UPDATE departments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
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
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
