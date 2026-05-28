import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
};

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];

export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
];

export const validateForgotPassword = [
  body('email').isEmail().normalizeEmail(),
];

export const validateResetPassword = [
  body('email').isEmail().normalizeEmail(),
  body('code').isLength({ min: 6, max: 6 }).matches(/^[0-9]{6}$/),
  body('new_password').isLength({ min: 8 }),
];

export const validatePatient = [
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('date_of_birth').isISO8601(),
  body('gender').isIn(['male', 'female', 'other']),
  body('phone').matches(/^\+?[0-9]{10,15}$/),
];

export const validateAppointment = [
  body('patient_id').isUUID(),
  body('doctor_id').isUUID(),
  body('appointment_date').isISO8601(),
  body('appointment_time').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  body('appointment_type').notEmpty(),
];

export default {
  validate,
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
  validatePatient,
  validateAppointment,
};
