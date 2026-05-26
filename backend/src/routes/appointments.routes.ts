import express from 'express';

import {
  getAppointments,
  getAppointmentById,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  markAppointmentAsAttended,
  markAppointmentAsCompleted
} from '../controllers/appointments.controller';

import {
  authenticate,
  authorize
} from '../middleware/auth.middleware';

const router = express.Router();


// Obtener citas de un paciente específico
router.get(
  '/patient/:patientId',
  authenticate,
  authorize(
    'admin',
    'doctor',
    'patient'
  ),
  getAppointmentsByPatient
);


// Obtener citas de un médico específico
router.get(
  '/doctor/:doctorId',
  authenticate,
  authorize(
    'admin',
    'doctor',
    'patient'
  ),
  getAppointmentsByDoctor
);


// Crear cita
router.post(
  '/',
  authenticate,
  authorize(
    'admin',
    'patient'
  ),
  createAppointment
);


// Obtener citas
router.get(
  '/',
  authenticate,
  authorize(
    'admin',
    'doctor',
    'patient'
  ),
  getAppointments
);


// Actualizar cita
router.put(
  '/:id',
  authenticate,
  authorize(
    'admin',
    'doctor',
    'patient'
  ),
  updateAppointment
);


// Cancelar cita
router.patch(
  '/:id/cancel',
  authenticate,
  authorize(
    'admin',
    'doctor',
    'patient'
  ),
  cancelAppointment
);


// Marcar cita como atendida
router.patch(
  '/:id/attend',
  authenticate,
  authorize(
    'admin',
    'doctor'
  ),
  markAppointmentAsAttended
);


// Marcar cita como completada con diagnóstico
router.patch(
  '/:id/complete',
  authenticate,
  authorize(
    'admin',
    'doctor'
  ),
  markAppointmentAsCompleted
);


// Obtener una cita específica
router.get(
  '/:id',
  authenticate,
  authorize(
    'admin',
    'doctor',
    'patient'
  ),
  getAppointmentById
);

export default router;
