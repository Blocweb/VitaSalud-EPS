"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rooms_controller_1 = require("../controllers/rooms.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, rooms_controller_1.getRooms);
router.get('/available/list', auth_middleware_1.authenticate, rooms_controller_1.getAvailableRooms);
router.get('/:id', auth_middleware_1.authenticate, rooms_controller_1.getRoomById);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), rooms_controller_1.createRoom);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), rooms_controller_1.updateRoom);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), rooms_controller_1.deleteRoom);
exports.default = router;
//# sourceMappingURL=rooms.routes.js.map