import { Request, Response } from 'express';
import { AppError, handleError } from '../utils/errors';
import { getEmailConfigFromDb, getEmailConfigFromEnv, sendEmail } from '../utils/mailer';
import { query } from '../config/database';

async function ensureEmailSettingsTable() {
  await query(
    `CREATE TABLE IF NOT EXISTS email_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      host TEXT NOT NULL,
      port INTEGER NOT NULL,
      secure BOOLEAN NOT NULL DEFAULT FALSE,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      from_email TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  );
}

export const getEmailSettings = async (_req: Request, res: Response) => {
  try {
    const [dbCfg, envCfg] = await Promise.all([getEmailConfigFromDb(), Promise.resolve(getEmailConfigFromEnv())]);
    const cfg = { ...dbCfg, ...envCfg };
    res.status(200).json({
      success: true,
      data: {
        host: cfg.host || '',
        port: cfg.port || 0,
        user: cfg.user || '',
        from: cfg.from || '',
        secure: cfg.secure ?? false,
      },
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({ success: false, message: appError.message });
  }
};

export const saveEmailSettings = async (req: Request, res: Response) => {
  try {
    const { host, port, user, pass, from, secure } = req.body || {};
    if (!host || !port || !user || !pass || !from) {
      throw new AppError(400, 'Missing required fields');
    }

    await ensureEmailSettingsTable();

    await query(
      `INSERT INTO email_settings (id, host, port, secure, username, password, from_email)
       VALUES (1, $1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         host = EXCLUDED.host,
         port = EXCLUDED.port,
         secure = EXCLUDED.secure,
         username = EXCLUDED.username,
         password = EXCLUDED.password,
         from_email = EXCLUDED.from_email,
         updated_at = CURRENT_TIMESTAMP`,
      [host, Number(port), Boolean(secure), user, pass, from]
    );

    res.status(200).json({
      success: true,
      message: 'Email settings saved successfully',
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({ success: false, message: appError.message });
  }
};

export const testEmailSettings = async (req: Request, res: Response) => {
  try {
    const { to, host, port, user, pass, from, secure } = req.body || {};
    if (!to) {
      throw new AppError(400, 'Missing required field: to');
    }

    await sendEmail({
      config: {
        host,
        port,
        user,
        pass,
        from,
        secure,
      },
      to,
      subject: 'VitaSalud - Prueba de correo',
      text: 'Este es un correo de prueba. La configuración SMTP está funcionando.',
    });

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({ success: false, message: appError.message });
  }
};

export default {
  getEmailSettings,
  saveEmailSettings,
  testEmailSettings,
};

