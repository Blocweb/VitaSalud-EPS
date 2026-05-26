import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { query, getClient } from '../config/database';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError, handleError } from '../utils/errors';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const result = await query(
      `SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, r.name as role, u.status
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1 AND u.deleted_at IS NULL`,
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError(401, 'Invalid credentials');
    }

    const user = result.rows[0];

    if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
      throw new AppError(403, 'Account is locked. Please try again later.');
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      await query(
        `UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1`,
        [user.id]
      );
      throw new AppError(401, 'Invalid credentials');
    }

    await query(
      `UPDATE users SET failed_login_attempts = 0, last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [user.id]
    );

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        status: user.status,
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

export const register = async (req: Request, res: Response) => {
  let client: PoolClient | undefined;

  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      date_of_birth,
      gender,
      address,
      city,
      state,
      insurance_provider,
    } = req.body;

    if (!email || !password || !first_name || !last_name) {
      throw new AppError(400, 'Missing required fields');
    }

    client = await getClient();
    await client.query('BEGIN');

    const existingUser = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await hashPassword(password);

    const roleResult = await client.query(
      `SELECT id FROM roles WHERE name = 'patient' LIMIT 1`
    );

    const roleId = roleResult.rows[0]?.id;
    if (!roleId) {
      throw new AppError(500, 'Patient role is not configured');
    }

    const result = await client.query(
      `INSERT INTO users (username, email, password_hash, role_id, first_name, last_name, phone, status, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
       RETURNING id, email, first_name, last_name, status`,
      [
        email.split('@')[0],
        email,
        passwordHash,
        roleId,
        first_name,
        last_name,
        phone || null,
        'active',
      ]
    );

    const newUser = result.rows[0];

    // Siempre crear el registro de paciente vinculado al usuario
    // Esto garantiza que patientsApi.me() siempre encuentre el perfil
    const patientResult = await client.query(
      `INSERT INTO patients (
        user_id, first_name, last_name, date_of_birth, gender,
        phone, email, address, city, state, insurance_provider, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
      RETURNING *`,
      [
        newUser.id,
        first_name,
        last_name,
        date_of_birth || null,
        gender || null,
        phone || null,
        email,
        address || null,
        city || null,
        state || null,
        insurance_provider || null,
      ]
    );

    const patient = patientResult.rows[0];

    await client.query('COMMIT');

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: 'patient',
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: 'patient',
        status: newUser.status,
      },
      patient,
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

export const verifyToken = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: req.user,
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
  login,
  register,
  verifyToken,
};
