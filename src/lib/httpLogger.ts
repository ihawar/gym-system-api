import pinoHttp from 'pino-http';
import logger from './logger';

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => (req.headers['x-request-id'] as string) || '',
  serializers: {
    req: (req: any) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
    }),
    res: (res: any) => ({
      statusCode: res.statusCode,
    }),
  },
});

export default httpLogger;
