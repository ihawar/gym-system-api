import adminController from '@/controllers/admin/admin';
import { authorize } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router.get('/', authorize('ADMIN'), adminController);

export default router;
