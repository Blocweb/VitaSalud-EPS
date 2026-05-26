"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prescriptions_controller_1 = require("../controllers/prescriptions.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'pharmacist', 'admin', 'patient'), prescriptions_controller_1.getPrescriptions);
router.get('/patient/:patientId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'pharmacist', 'admin', 'patient'), prescriptions_controller_1.getPrescriptionsByPatient);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'pharmacist', 'admin', 'patient'), prescriptions_controller_1.getPrescriptionById);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'admin'), prescriptions_controller_1.createPrescription);
router.patch('/:id/dispense', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('pharmacist', 'admin'), prescriptions_controller_1.dispensePrescription);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), prescriptions_controller_1.deletePrescription);
exports.default = router;
//# sourceMappingURL=prescriptions.routes.js.map