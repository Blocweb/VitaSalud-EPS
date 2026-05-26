import express from 'express';
import {
  getLabTests,
  getLabTestById,
  getLabTestsByPatient,
  createLabTest,
  updateLabTestResults,
  updateLabTestStatus,
  deleteLabTest,
} from '../controllers/lab-tests.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, authorize('doctor', 'lab_technician', 'admin', 'patient'), getLabTests);
router.get('/patient/:patientId', authenticate, authorize('doctor', 'lab_technician', 'admin', 'patient'), getLabTestsByPatient);
router.get('/:id', authenticate, authorize('doctor', 'lab_technician', 'admin', 'patient'), getLabTestById);
router.post('/', authenticate, authorize('doctor', 'admin'), createLabTest);
router.put('/:id/results', authenticate, authorize('lab_technician', 'admin'), updateLabTestResults);
router.patch('/:id/status', authenticate, authorize('lab_technician', 'admin'), updateLabTestStatus);
router.delete('/:id', authenticate, authorize('admin'), deleteLabTest);

export default router;
