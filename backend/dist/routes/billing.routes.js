"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billing_controller_1 = require("../controllers/billing.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('receptionist', 'admin', 'patient'), billing_controller_1.getBilling);
router.get('/pending/list', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('receptionist', 'admin'), billing_controller_1.getPendingBilling);
router.get('/patient/:patientId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('receptionist', 'admin', 'patient'), billing_controller_1.getBillingByPatient);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('receptionist', 'admin', 'patient'), billing_controller_1.getBillingById);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('receptionist', 'admin'), billing_controller_1.createBilling);
router.patch('/:id/payment', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('receptionist', 'admin', 'patient'), billing_controller_1.recordPayment);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), billing_controller_1.deleteBilling);
exports.default = router;
//# sourceMappingURL=billing.routes.js.map