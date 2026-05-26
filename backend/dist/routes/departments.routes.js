"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const departments_controller_1 = require("../controllers/departments.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, departments_controller_1.getDepartments);
router.get('/:id', auth_middleware_1.authenticate, departments_controller_1.getDepartmentById);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), departments_controller_1.createDepartment);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), departments_controller_1.updateDepartment);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), departments_controller_1.deleteDepartment);
exports.default = router;
//# sourceMappingURL=departments.routes.js.map