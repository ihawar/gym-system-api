import accountController from '@/controllers/account/account';
import updateController from '@/controllers/account/update';
import { authenticate, completed } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, completed, accountController);
router.put('/', authenticate, completed, updateController);

export default router;
