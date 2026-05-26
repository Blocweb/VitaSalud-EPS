import express from 'express';
import {
  getRooms,
  getRoomById,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/rooms.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, getRooms);
router.get('/available/list', authenticate, getAvailableRooms);
router.get('/:id', authenticate, getRoomById);
router.post('/', authenticate, authorize('admin'), createRoom);
router.put('/:id', authenticate, authorize('admin'), updateRoom);
router.delete('/:id', authenticate, authorize('admin'), deleteRoom);

export default router;
