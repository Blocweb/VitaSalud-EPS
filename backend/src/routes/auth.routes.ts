import express from 'express';
import { forgotPassword, login, register, resetPassword, verifyToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, validateForgotPassword, validateLogin, validateRegister, validateResetPassword } from '../middleware/validation.middleware';

const router = express.Router();

router.post('/login', validateLogin, validate, login);
router.post('/register', validateRegister, validate, register);
router.post('/forgot-password', validateForgotPassword, validate, forgotPassword);
router.post('/reset-password', validateResetPassword, validate, resetPassword);
router.get('/verify', authenticate, verifyToken);

export default router;
