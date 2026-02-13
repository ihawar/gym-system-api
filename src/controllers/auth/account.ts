import { prisma } from '@/lib/prisma';
import type { Request, Response, NextFunction } from 'express';

export async function AccountController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user?.id },
    });
    const { password, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    next(err);
  }
}
