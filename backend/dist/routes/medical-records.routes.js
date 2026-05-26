"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medical_records_controller_1 = require("../controllers/medical-records.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'admin', 'patient'), medical_records_controller_1.getMedicalRecords);
router.get('/patient/:patientId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'admin', 'patient'), medical_records_controller_1.getMedicalRecordsByPatient);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'admin', 'patient'), medical_records_controller_1.getMedicalRecordById);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'admin'), medical_records_controller_1.createMedicalRecord);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'admin'), medical_records_controller_1.updateMedicalRecord);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), medical_records_controller_1.deleteMedicalRecord);
exports.default = router;
//# sourceMappingURL=medical-records.routes.js.map