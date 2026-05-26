import express from 'express';
import { login, register, verifyToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, validateLogin, validateRegister } from '../middleware/validation.middleware';

const router = express.Router();

router.post('/login', validateLogin, validate, login);
router.post('/register', validateRegister, validate, register);
router.get('/verify', authenticate, verifyToken);

export default router;
