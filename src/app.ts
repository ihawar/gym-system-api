import express, { Request, Response } from 'express';
import cors from 'cors';
// routes
import authRouter from './routes/auth';
import accountRouter from './routes/account';
// middlewares
import httpLogger from './lib/httpLogger';
import { errorHandler, notFound } from './middlewares/error';
import cookieParser from 'cookie-parser';

const app = express();

// ----------
// middlewares
// ----------
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.set('trust proxy', true);
app.use(httpLogger);

// ----------
// routers
// ----------
app.use('/api/auth', authRouter);
app.use('/api/account', accountRouter);

// Example route usage
app.get('/health', (req, res) => {
  req.log.info({ url: req.url, method: req.method }, 'health check');
  res.send({ ok: true });
});

// ----------
// error handlers
// ----------
app.use(notFound);
app.use(errorHandler);

export default app;
