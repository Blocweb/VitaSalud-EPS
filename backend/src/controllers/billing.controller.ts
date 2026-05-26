import { Request, Response } from 'express';
import { query } from '../config/database';
import { AppError, handleError } from '../utils/errors';

export const getBilling = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT b.id, b.invoice_number, b.invoice_date, b.total_amount, b.amount_paid,
              b.balance, b.status,
              p.first_name || ' ' || p.last_name as patient_name,
              b.created_at
       FROM billing b
       JOIN patients p ON b.patient_id = p.id
       WHERE b.deleted_at IS NULL
       ORDER BY b.invoice_date DESC`
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

export const getBillingById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No user found');
    }

    const { id } = req.params;

    const billing = await query(
      `SELECT b.*, p.id as patient_id, p.user_id as patient_user_id FROM billing b
       JOIN patients p ON b.patient_id = p.id
       WHERE b.id = $1 AND b.deleted_at IS NULL`,
      [id]
    );

    if (billing.rows.length === 0) {
      throw new AppError(404, 'Billing record not found');
    }

    // Validar permisos
    if (req.user.role === 'patient' && billing.rows[0].patient_user_id !== req.user.id) {
      throw new AppError(403, 'Insufficient permissions');
    }

    const items = await query(
      `SELECT * FROM billing_items WHERE billing_id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...billing.rows[0],
        items: items.rows,
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

export const getBillingByPatient = async (req: Request, res: Response) => {
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
      `SELECT b.id, b.invoice_number, b.invoice_date, b.total_amount, b.amount_paid,
              b.balance, b.status
       FROM billing b
       WHERE b.patient_id = $1 AND b.deleted_at IS NULL
       ORDER BY b.invoice_date DESC`,
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

export const getPendingBilling = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT b.id, b.invoice_number, b.invoice_date, b.due_date, b.total_amount,
              b.amount_paid, b.balance, b.status,
              p.first_name || ' ' || p.last_name as patient_name,
              CASE 
                WHEN b.due_date < CURRENT_DATE THEN 'Overdue'
                WHEN b.due_date = CURRENT_DATE THEN 'Due Today'
                ELSE 'Pending'
              END AS payment_urgency
       FROM billing b
       JOIN patients p ON b.patient_id = p.id
       WHERE b.status IN ('pending', 'partially_paid')
         AND b.deleted_at IS NULL
       ORDER BY b.due_date ASC`
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

export const createBilling = async (req: Request, res: Response) => {
  try {
    const { patient_id, appointment_id, medical_record_id, subtotal, tax_amount, discount_amount, items } = req.body;

    if (!patient_id || !subtotal) {
      throw new AppError(400, 'Missing required fields');
    }

    const total_amount = subtotal + tax_amount - discount_amount;

    const billResult = await query(
      `INSERT INTO billing (patient_id, appointment_id, medical_record_id, subtotal, tax_amount, discount_amount, total_amount, balance, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING *`,
      [patient_id, appointment_id || null, medical_record_id || null, subtotal, tax_amount || 0, discount_amount || 0, total_amount, total_amount]
    );

    const billing = billResult.rows[0];

    if (items && items.length > 0) {
      for (const item of items) {
        await query(
          `INSERT INTO billing_items (billing_id, description, item_type, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [billing.id, item.description, item.item_type, item.quantity || 1, item.unit_price, item.total_price]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Billing record created successfully',
      data: billing,
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
    });
  }
};

export const recordPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount_paid, payment_method, transaction_id } = req.body;

    if (!amount_paid) {
      throw new AppError(400, 'Payment amount is required');
    }

    const result = await query(
      `UPDATE billing SET 
        amount_paid = amount_paid + $1,
        payment_method = COALESCE($2, payment_method),
        transaction_id = COALESCE($3, transaction_id),
        payment_date = CURRENT_DATE
       WHERE id = $4 AND deleted_at IS NULL
       RETURNING *`,
      [amount_paid, payment_method || null, transaction_id || null, id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Billing record not found');
    }

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
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

export const deleteBilling = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await query(
      `UPDATE billing SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Billing record deleted successfully',
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
  getBilling,
  getBillingById,
  getBillingByPatient,
  getPendingBilling,
  createBilling,
  recordPayment,
  deleteBilling,
};
