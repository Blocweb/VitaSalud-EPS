import express from 'express';
import {
  getMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordsByPatient,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '../controllers/medical-records.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, authorize('doctor', 'admin', 'patient'), getMedicalRecords);
router.get('/patient/:patientId', authenticate, authorize('doctor', 'admin', 'patient'), getMedicalRecordsByPatient);
router.get('/:id', authenticate, authorize('doctor', 'admin', 'patient'), getMedicalRecordById);
router.post('/', authenticate, authorize('doctor', 'admin'), createMedicalRecord);
router.put('/:id', authenticate, authorize('doctor', 'admin'), updateMedicalRecord);
router.delete('/:id', authenticate, authorize('admin'), deleteMedicalRecord);

export default router;
