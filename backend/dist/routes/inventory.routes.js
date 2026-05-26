"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventory_controller_1 = require("../controllers/inventory.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, inventory_controller_1.getInventory);
router.get('/low-stock/list', auth_middleware_1.authenticate, inventory_controller_1.getLowStockItems);
router.get('/:id', auth_middleware_1.authenticate, inventory_controller_1.getInventoryById);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('pharmacist', 'admin'), inventory_controller_1.createInventoryItem);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('pharmacist', 'admin'), inventory_controller_1.updateInventoryItem);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), inventory_controller_1.deleteInventoryItem);
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map