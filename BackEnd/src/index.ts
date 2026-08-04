import express from 'express';
import http from 'http';
import cors from 'cors';
import { AppDataSource } from './config/dbConfig';
import routes from './routes';
import { setupSwagger } from './swagger';
import { attachLikeWebSocket } from './realtime/likeHub';
import { correlationIdMiddleware } from './middlewares/correlation.middleware';
import { logger } from './helpers/logger';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(correlationIdMiddleware);
app.use('/api', routes);

const PORT = Number(process.env.PORT) || 8876;
const server = http.createServer(app);

AppDataSource.initialize()
  .then(() => {
    setupSwagger(app);
    attachLikeWebSocket(server);
    server.listen(PORT, () => {
      logger.info('posts.api.started', {
        port: PORT,
        wsPath: '/ws',
      });
    });
  })
  .catch((err) => {
    logger.error('posts.api.db_init_failed', { error: String(err) });
    process.exit(1);
  });
