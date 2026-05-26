"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lab_tests_controller_1 = require("../controllers/lab-tests.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'lab_technician', 'admin', 'patient'), lab_tests_controller_1.getLabTests);
router.get('/patient/:patientId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'lab_technician', 'admin', 'patient'), lab_tests_controller_1.getLabTestsByPatient);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'lab_technician', 'admin', 'patient'), lab_tests_controller_1.getLabTestById);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'admin'), lab_tests_controller_1.createLabTest);
router.put('/:id/results', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('lab_technician', 'admin'), lab_tests_controller_1.updateLabTestResults);
router.patch('/:id/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('lab_technician', 'admin'), lab_tests_controller_1.updateLabTestStatus);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), lab_tests_controller_1.deleteLabTest);
exports.default = router;
//# sourceMappingURL=lab-tests.routes.js.map