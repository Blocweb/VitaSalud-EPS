import express from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departments.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, getDepartments);
router.get('/:id', authenticate, getDepartmentById);
router.post('/', authenticate, authorize('admin'), createDepartment);
router.put('/:id', authenticate, authorize('admin'), updateDepartment);
router.delete('/:id', authenticate, authorize('admin'), deleteDepartment);

export default router;
