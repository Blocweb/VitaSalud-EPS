import express from 'express';

import {
  getPatients,
  getPatientById,
  getCurrentPatient,
  createPatient,
  updateCurrentPatient,
  updatePatient,
  deletePatient
} from '../controllers/patients.controller';

import {
  authenticate,
  authorize
} from '../middleware/auth.middleware';

const router = express.Router();

// ====================== PACIENTE (rutas específicas ANTES de /:id) ======================

// Ver su propio perfil — DEBE ir antes de /:id para que Express no lo trate como id='me'
router.get(
  '/me',
  authenticate,
  authorize('patient', 'admin', 'doctor'),
  getCurrentPatient
);

// Actualizar solo su perfil
router.put(
  '/me',
  authenticate,
  authorize('patient'),
  updateCurrentPatient
);

// ====================== ADMIN / DOCTOR ======================

// Ver todos los pacientes
router.get(
  '/',
  authenticate,
  authorize('admin', 'doctor'),
  getPatients
);

// Crear paciente
router.post(
  '/',
  authenticate,
  authorize('admin'),
  createPatient
);

// Ver paciente específico
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'doctor'),
  getPatientById
);

// Actualizar cualquier paciente
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'doctor'),
  updatePatient
);

// Eliminar paciente
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  deletePatient
);

export default router;
