"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patients_controller_1 = require("../controllers/patients.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// ====================== PACIENTE (rutas específicas ANTES de /:id) ======================
// Ver su propio perfil — DEBE ir antes de /:id para que Express no lo trate como id='me'
router.get('/me', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('patient', 'admin', 'doctor'), patients_controller_1.getCurrentPatient);
// Actualizar solo su perfil
router.put('/me', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('patient'), patients_controller_1.updateCurrentPatient);
// ====================== ADMIN / DOCTOR ======================
// Ver todos los pacientes
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor'), patients_controller_1.getPatients);
// Crear paciente
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), patients_controller_1.createPatient);
// Ver paciente específico
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor'), patients_controller_1.getPatientById);
// Actualizar cualquier paciente
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'doctor'), patients_controller_1.updatePatient);
// Eliminar paciente
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), patients_controller_1.deletePatient);
exports.default = router;
//# sourceMappingURL=patients.routes.js.map