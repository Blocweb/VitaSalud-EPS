import express from 'express';
import {
  getBilling,
  getBillingById,
  getBillingByPatient,
  getPendingBilling,
  createBilling,
  recordPayment,
  deleteBilling,
} from '../controllers/billing.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, authorize('receptionist', 'admin', 'patient'), getBilling);
router.get('/pending/list', authenticate, authorize('receptionist', 'admin'), getPendingBilling);
router.get('/patient/:patientId', authenticate, authorize('receptionist', 'admin', 'patient'), getBillingByPatient);
router.get('/:id', authenticate, authorize('receptionist', 'admin', 'patient'), getBillingById);
router.post('/', authenticate, authorize('receptionist', 'admin'), createBilling);
router.patch('/:id/payment', authenticate, authorize('receptionist', 'admin', 'patient'), recordPayment);
router.delete('/:id', authenticate, authorize('admin'), deleteBilling);

export default router;
