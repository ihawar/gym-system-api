import 'dotenv/config';
import app from './app';
import logger from './lib/logger';

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  logger.info(`Sever listening on http://${HOST}:${PORT}`);
});
