import adminController from '@/controllers/admin/admin';
import usersController from '@/controllers/admin/users';
import { authenticate, authorize } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), adminController);
router.get('/users', authenticate, authorize('ADMIN'), usersController);

export default router;
