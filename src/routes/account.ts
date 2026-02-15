import accountController from '@/controllers/account/account';
import editController from '@/controllers/account/edit';
import { authenticate, completed } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, completed, accountController);
router.put('/', authenticate, completed, editController);

export default router;
