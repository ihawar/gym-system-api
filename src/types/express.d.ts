import type pino from 'pino';
import type { Request } from 'express';
import { Role } from '@prisma/client';
// add pino logger to request object
declare global {
  namespace Express {
    interface Request {
      log: pino.Logger;
      user?: {
        id: number;
        phone: string;
        role: Role;
        completed: boolean;
        verified: boolean;
      };
    }
  }
}
