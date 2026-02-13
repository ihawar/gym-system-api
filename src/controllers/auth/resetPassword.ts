import { prisma } from '@/lib/prisma';
import { AppError } from '@/types/customError';
import { hashPassword } from '@/utils/auth';
import parsePhone from '@/utils/parsePhone';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  phone: z.string(),
  password: z.string(),
  otpCode: z.string(),
});

export async function ResetPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const body = resetPasswordSchema.safeParse(req.body);
    if (!body.success) throw new AppError('Invalid input', 400, true);
    let { password, otpCode, phone } = body.data;
    phone = parsePhone(phone);
    const otp = await prisma.oTP.findFirst({
      where: {
        phone: phone,
        code: otpCode,
        type: 'RESET_PASSWORD',
        expireAt: { gt: new Date() },
      },
    });
    if (!otp) throw new AppError('Invalid credentials', 401, true);

    await prisma.user.update({
      where: { phone: otp.phone },
      data: { password: hashPassword(password) },
    });
    await prisma.oTP.delete({ where: { id: otp.id } });
    return res.json({ message: 'Password updated.' });
  } catch (err) {
    next(err);
  }
}
