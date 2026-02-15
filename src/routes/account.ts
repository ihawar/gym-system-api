import accountController from '@/controllers/account/account';
import { authenticate } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, accountController);

export default router;
