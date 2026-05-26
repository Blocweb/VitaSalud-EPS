import express from 'express';

import {
  getDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
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
    'patient'
  ),
  getDoctors
);

router.get(
  '/specialization/:specialization',
  authenticate,
  authorize(
    'doctor',
    'patient'
  ),
  getDoctorsBySpecialization
);

router.get(
  '/:id',
  authenticate,
  authorize(
    'doctor',
    'patient'
  ),
  getDoctorById
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