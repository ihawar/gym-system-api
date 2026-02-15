import adminController from '@/controllers/admin/admin';
import userInfoController from '@/controllers/admin/user.info';
import userUpdateController from '@/controllers/admin/user.update';
import usersController from '@/controllers/admin/users';
import { authenticate, authorize } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), adminController);

router.get('/users', authenticate, authorize('ADMIN'), usersController);

router.get('/user/:userId', authenticate, authorize('ADMIN'), userInfoController);
router.put('/user/:userId', authenticate, authorize('ADMIN'), userUpdateController);

export default router;
