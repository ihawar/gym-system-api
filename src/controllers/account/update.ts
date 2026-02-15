import type { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/types/customError';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const editSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  bio: z.string().max(1000).optional(),
  birthDate: z
    .string()
    .refine((s) => !s || !Number.isNaN(Date.parse(s)), {
      message: 'Invalid date',
    })
    .optional(),
  heightCm: z.number().min(0).max(300).optional(),
  weight: z.number().min(0).max(1000).optional(),
});

export default async function updateController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user || !req.user.id) throw new AppError('No token provided', 401, true);

    const parsed = editSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Invalid request body', 400, true);
    }

    const data: any = {};
    const { firstName, lastName, bio, birthDate, heightCm, weight } = parsed.data;
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (bio !== undefined) data.bio = bio;
    if (birthDate !== undefined) data.birthDate = birthDate ? new Date(birthDate) : null;
    if (heightCm !== undefined) data.heightCm = heightCm;
    if (weight !== undefined) data.weight = weight;

    const user = await prisma.user.update({
      where: { id: req.user.id, blocked: false },
      data,
      select: {
        id: true,
        phone: true,
        verified: true,
        completed: true,
        avatarUrl: true,
        bio: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        heightCm: true,
        weight: true,
        role: true,
      },
    });
    res.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return next(new AppError('User not found.', 404, true));
    }
    next(error);
  }
}
