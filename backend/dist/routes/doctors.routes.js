"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctors_controller_1 = require("../controllers/doctors.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'patient'), doctors_controller_1.getDoctors);
router.get('/specialization/:specialization', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'patient'), doctors_controller_1.getDoctorsBySpecialization);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('doctor', 'patient'), doctors_controller_1.getDoctorById);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), doctors_controller_1.updateDoctor);
exports.default = router;
//# sourceMappingURL=doctors.routes.js.map