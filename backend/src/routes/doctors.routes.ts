import express from 'express';

import {
  getDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  createDoctor,
  updateDoctor
} from '../controllers/doctors.controller';

import {
  authenticate,
  authorize
} from '../middleware/auth.middleware';

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorize(
    'doctor',
    'patient',
    'admin'
  ),
  getDoctors
);

router.get(
  '/specialization/:specialization',
  authenticate,
  authorize(
    'doctor',
    'patient',
    'admin'
  ),
  getDoctorsBySpecialization
);

router.get(
  '/:id',
  authenticate,
  authorize(
    'doctor',
    'patient',
    'admin'
  ),
  getDoctorById
);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  createDoctor
);

router.put(
  '/:id',
  authenticate,
  authorize(
    'admin'
  ),
  updateDoctor
);

export default router;