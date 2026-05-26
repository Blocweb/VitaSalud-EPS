import express from 'express';
import {
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  createPrescription,
  dispensePrescription,
  deletePrescription,
} from '../controllers/prescriptions.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, authorize('doctor', 'pharmacist', 'admin', 'patient'), getPrescriptions);
router.get('/patient/:patientId', authenticate, authorize('doctor', 'pharmacist', 'admin', 'patient'), getPrescriptionsByPatient);
router.get('/:id', authenticate, authorize('doctor', 'pharmacist', 'admin', 'patient'), getPrescriptionById);
router.post('/', authenticate, authorize('doctor', 'admin'), createPrescription);
router.patch('/:id/dispense', authenticate, authorize('pharmacist', 'admin'), dispensePrescription);
router.delete('/:id', authenticate, authorize('admin'), deletePrescription);

export default router;
