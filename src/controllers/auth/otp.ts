import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types/customError';
import { prisma } from '@/lib/prisma';
import { generateOTPCode, sendOTP } from '@/lib/otp';
import parsePhone from '@/utils/parsePhone';
import { z } from 'zod';
import { OTPType } from '@prisma/client';

const otpSchema = z.object({
  phone: z.string().min(8),
  type: z.enum(OTPType),
});

export async function OTPController(req: Request, res: Response, next: NextFunction) {
  try {
    const query = otpSchema.safeParse(req.query);
    if (!query.success) throw new AppError('Invalid input', 400, true);
    let { phone, type } = query.data;
    phone = parsePhone(phone);
    // send OTP
    let otp = await prisma.oTP.findFirst({ where: { phone: phone, type: type } });

    if (otp) {
      if (otp && otp.updatedAt.getTime() > Date.now() - 60 * 1000) {
        throw new AppError('You need to wait before requesting a new code.', 429, true);
      } else {
        // if it exists just update it
        otp = await prisma.oTP.update({
          where: { id: otp.id },
          data: {
            code: generateOTPCode(6),
            updatedAt: new Date(),
            expireAt: new Date(Date.now() + 5 * 60 * 1000),
          },
        });
      }
    } else {
      // if there is no create one
      otp = await prisma.oTP.create({
        data: {
          phone: phone,
          code: generateOTPCode(6),
          type: type,
          expireAt: new Date(Date.now() + 5 * 60 * 1000),
          updatedAt: new Date(),
        },
      });
    }

    await sendOTP(otp);
    return res.json({ message: 'Code sent.' });
  } catch (error) {
    next(error);
  }
}
