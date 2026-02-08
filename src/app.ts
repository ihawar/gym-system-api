import express, { Request, Response } from 'express';
import cors from 'cors';
import httpLogger from './lib/httpLogger';

const app = express();

// ----------
// middlewares
// ----------
app.use(express.json());
app.use(cors());
app.set('trust proxy', true);
app.use(httpLogger);

// Example route usage
app.get('/health', (req, res) => {
  req.log.info({ url: req.url, method: req.method }, 'health check');
  res.send({ ok: true });
});

export default app;
