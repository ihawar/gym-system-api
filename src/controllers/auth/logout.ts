import type { Request, Response, NextFunction } from 'express';

export async function LogoutController(req: Request, res: Response, next: NextFunction) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(204).end();
}
