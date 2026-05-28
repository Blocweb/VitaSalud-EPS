import nodemailer from 'nodemailer';
import { query } from '../config/database';
import { AppError } from './errors';

export type EmailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  from: string;
};

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

export function getEmailConfigFromEnv(): Partial<EmailConfig> {
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : undefined;

  return {
    host: process.env.SMTP_HOST,
    port,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    secure,
    from: process.env.SMTP_FROM,
  };
}

export async function getEmailConfigFromDb(): Promise<Partial<EmailConfig>> {
  await ensureEmailSettingsTable();
  const result = await query(`SELECT host, port, secure, username, password, from_email FROM email_settings WHERE id = 1`);
  if (result.rows.length === 0) return {};
  const row = result.rows[0];
  return {
    host: row.host,
    port: row.port,
    secure: row.secure,
    user: row.username,
    pass: row.password,
    from: row.from_email,
  };
}

export function buildTransport(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export async function sendEmail(options: {
  config?: Partial<EmailConfig>;
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const [dbConfig, envConfig] = await Promise.all([getEmailConfigFromDb(), Promise.resolve(getEmailConfigFromEnv())]);
  const merged: any = { ...dbConfig, ...envConfig, ...options.config };

  const required = ['host', 'port', 'user', 'pass', 'from', 'secure'] as const;
  for (const key of required) {
    if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
      throw new AppError(500, `Email service not configured (missing ${key})`);
    }
  }

  const transporter = buildTransport(merged as EmailConfig);
  await transporter.sendMail({
    from: merged.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}

