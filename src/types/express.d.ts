import type pino from 'pino';
import type { Request } from 'express';
// add pino logger to request object
declare global {
  namespace Express {
    interface Request {
      log: pino.Logger;
    }
  }
}
