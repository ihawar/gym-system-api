import { AccountController } from '@/controllers/auth/account';
import { CompleteController } from '@/controllers/auth/complete';
import { LoginController } from '@/controllers/auth/login';
import { LogoutController } from '@/controllers/auth/logout';
import { OTPController } from '@/controllers/auth/otp';
import { RefreshController } from '@/controllers/auth/refresh';
import { ResetPasswordController } from '@/controllers/auth/resetPassword';
import { authenticate, completed } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router.post('/sendOTP', OTPController);

router.post('/login', LoginController);
router.post('/refresh', RefreshController);

router.post('/complete', authenticate, CompleteController);
router.post('/resetPassword', ResetPasswordController);

router.post('/logout', LogoutController);

router.get('/me', authenticate, completed, AccountController);

export default router;
