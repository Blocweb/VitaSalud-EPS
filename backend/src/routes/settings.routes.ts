import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { getEmailSettings, saveEmailSettings, testEmailSettings } from '../controllers/settings.controller';

const router = express.Router();

router.get('/email', authenticate, authorize('admin'), getEmailSettings);
router.put('/email', authenticate, authorize('admin'), saveEmailSettings);
router.post('/email/test', authenticate, authorize('admin'), testEmailSettings);

export default router;

