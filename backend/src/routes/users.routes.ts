import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/users.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
