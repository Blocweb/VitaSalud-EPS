"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = express_1.default.Router();
router.post('/login', validation_middleware_1.validateLogin, validation_middleware_1.validate, auth_controller_1.login);
router.post('/register', validation_middleware_1.validateRegister, validation_middleware_1.validate, auth_controller_1.register);
router.get('/verify', auth_middleware_1.authenticate, auth_controller_1.verifyToken);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map