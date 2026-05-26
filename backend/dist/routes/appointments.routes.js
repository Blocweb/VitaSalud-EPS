"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointments_controller_1 = require("../controllers/appointments.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Obtener citas de un paciente específico
router.get('/patient/:patientId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor', 'patient'), appointments_controller_1.getAppointmentsByPatient);
// Obtener citas de un médico específico
router.get('/doctor/:doctorId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor', 'patient'), appointments_controller_1.getAppointmentsByDoctor);
// Crear cita
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor', 'patient'), appointments_controller_1.createAppointment);
// Obtener citas
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor', 'patient'), appointments_controller_1.getAppointments);
// Actualizar cita
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor', 'patient'), appointments_controller_1.updateAppointment);
// Cancelar cita
router.patch('/:id/cancel', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor', 'patient'), appointments_controller_1.cancelAppointment);
// Obtener una cita específica
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor', 'patient'), appointments_controller_1.getAppointmentById);
exports.default = router;
//# sourceMappingURL=appointments.routes.js.map