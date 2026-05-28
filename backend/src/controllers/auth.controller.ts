import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import crypto from 'crypto';
import { query, getClient } from '../config/database';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError, handleError } from '../utils/errors';
import { sendEmail } from '../utils/mailer';

function generate6DigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function passwordResetHtml(code: string, minutesValid: number) {
  return `
  <div style="background:#f5f7fa;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:linear-gradient(90deg,#0D47A1,#1E88E5);padding:18px 22px;color:#ffffff;">
        <div style="font-size:18px;font-weight:700;letter-spacing:0.2px;">VitaSalud</div>
        <div style="font-size:13px;opacity:0.9;margin-top:4px;">Recuperación de contraseña</div>
      </div>
      <div style="padding:22px;color:#111827;">
        <p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#374151;">
          Usa el siguiente código para continuar con la recuperación de tu contraseña:
        </p>
        <div style="text-align:center;margin:18px 0;">
          <div style="display:inline-block;background:#EFF6FF;border:1px solid #BFDBFE;color:#1D4ED8;
                      font-size:28px;font-weight:800;letter-spacing:6px;padding:14px 18px;border-radius:12px;">
            ${code}
          </div>
        </div>
        <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:#6B7280;">
          Este código es válido por <b>${minutesValid} minutos</b>. Si no solicitaste este cambio, ignora este correo.
        </p>
        <div style="margin-top:18px;padding-top:14px;border-top:1px solid #E5E7EB;color:#9CA3AF;font-size:12px;">
          © ${new Date().getFullYear()} VitaSalud
        </div>
      </div>
    </div>
  </div>
  `;
}

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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    const result = await query(
      `SELECT id, email, first_name FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [email]
    );

    // Respuesta neutra para no filtrar si existe
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a verification code was sent',
      });
    }

    const user = result.rows[0];
    const code = generate6DigitCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await query(
      `UPDATE users
       SET reset_password_token = $1,
           reset_password_expires = $2
       WHERE id = $3`,
      [sha256(code), expiresAt.toISOString(), user.id]
    );

    await sendEmail({
      to: user.email,
      subject: 'VitaSalud - Código de verificación',
      text: `Tu código de verificación es: ${code}. Válido por 10 minutos.`,
      html: passwordResetHtml(code, 10),
    });

    return res.status(200).json({
      success: true,
      message: 'If the email exists, a verification code was sent',
    });
  } catch (error) {
    const appError = handleError(error);
    return res.status(appError.statusCode).json({ success: false, message: appError.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, new_password } = req.body || {};
    if (!email || !code || !new_password) {
      throw new AppError(400, 'Missing required fields');
    }
    if (String(new_password).length < 8) {
      throw new AppError(400, 'Password must be at least 8 characters');
    }

    const result = await query(
      `SELECT id, reset_password_token, reset_password_expires
       FROM users
       WHERE email = $1 AND deleted_at IS NULL`,
      [email]
    );
    if (result.rows.length === 0) {
      throw new AppError(400, 'Invalid code');
    }

    const user = result.rows[0];
    if (!user.reset_password_token || !user.reset_password_expires) {
      throw new AppError(400, 'Invalid code');
    }
    if (new Date(user.reset_password_expires) < new Date()) {
      throw new AppError(400, 'Code expired');
    }
    if (user.reset_password_token !== sha256(String(code))) {
      throw new AppError(400, 'Invalid code');
    }

    const passwordHash = await hashPassword(String(new_password));
    await query(
      `UPDATE users
       SET password_hash = $1,
           reset_password_token = NULL,
           reset_password_expires = NULL
       WHERE id = $2`,
      [passwordHash, user.id]
    );

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    const appError = handleError(error);
    return res.status(appError.statusCode).json({ success: false, message: appError.message });
  }
};

export default {
  login,
  register,
  verifyToken,
  forgotPassword,
  resetPassword,
};
