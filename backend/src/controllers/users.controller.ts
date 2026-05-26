import { Request, Response } from 'express';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.phone, u.status, r.name as role, u.created_at
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.deleted_at IS NULL
       ORDER BY u.created_at DESC`
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

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.phone, u.status, u.avatar_url, r.name as role, u.created_at
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1 AND u.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found');
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, avatar_url } = req.body;

    // Check if user exists
    const existingUser = await query(
      `SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (existingUser.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    // Update user
    const result = await query(
      `UPDATE users SET first_name = $1, last_name = $2, phone = $3, avatar_url = $4
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING id, email, first_name, last_name, phone, status, avatar_url`,
      [first_name, last_name, phone, avatar_url, id]
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete
    await query(
      `UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
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
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
