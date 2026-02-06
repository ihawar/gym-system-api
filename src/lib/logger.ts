import pino from 'pino';

const level = process.env.LOG_LEVEL ?? 'info';
const base = { service: 'gym-system-api', env: process.env.NODE_ENV ?? 'development' };
const logger = pino({
  level,
  base,
  transport: { target: 'pino-pretty', options: { colorize: true, translateTime: true } },
});

export default logger;
