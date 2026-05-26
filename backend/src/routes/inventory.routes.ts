import express from 'express';
import {
  getInventory,
  getInventoryById,
  getLowStockItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventory.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, getInventory);
router.get('/low-stock/list', authenticate, getLowStockItems);
router.get('/:id', authenticate, getInventoryById);
router.post('/', authenticate, authorize('pharmacist', 'admin'), createInventoryItem);
router.put('/:id', authenticate, authorize('pharmacist', 'admin'), updateInventoryItem);
router.delete('/:id', authenticate, authorize('admin'), deleteInventoryItem);

export default router;
