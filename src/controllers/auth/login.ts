import { createAccessToken, createRefreshToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/types/customError';
import { verifyPassword } from '@/utils/auth';
import parsePhone from '@/utils/parsePhone';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  phone: z.string(),
  password: z.string().optional(),
  otpCode: z.string().optional(),
});

export async function LoginController(req: Request, res: Response, next: NextFunction) {
  try {
    const body = loginSchema.safeParse(req.body);
    if (!body.success || (!body.data.otpCode && !body.data.password))
      throw new AppError('Invalid input', 400, true);

    let { phone, password, otpCode } = body.data;
    phone = parsePhone(phone);

    let user = await prisma.user.findUnique({
      where: { phone, blocked: false },
    });
    if (password) {
      // password login
      if (!user || (user.password && !(await verifyPassword(password, user.password)))) {
        throw new AppError('Invalid credentials', 401, true);
      }
    } else {
      // validate OTP
      const otp = await prisma.oTP.findFirst({
        where: { phone, code: otpCode, type: 'REGISTER', expireAt: { gt: new Date() } },
      });
      if (!otp) {
        throw new AppError('Invalid credentials', 401, true);
      }
      // create a user if does not exists
      if (!user) {
        user = await prisma.user.create({ data: { phone } });
      }
      await prisma.oTP.delete({ where: { id: otp.id } });
    }

    // provide the required tokens
    const accessToken = await createAccessToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
      completed: user.completed,
      verified: user.verified,
    });
    const refreshToken = await createRefreshToken({ userId: user.id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}
