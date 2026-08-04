import express from 'express';
import http from 'http';
import cors from 'cors';
import { AppDataSource } from './config/dbConfig';
import routes from './routes';
import { setupSwagger } from './swagger';
import { attachLikeWebSocket } from './realtime/likeHub';
import { connectMqttPublisher, getMqttLikesTopic } from './realtime/mqttPublisher';
import { correlationIdMiddleware } from './middlewares/correlation.middleware';
import { requestLoggingMiddleware } from './middlewares/requestLogging.middleware';
import { logger } from './helpers/logger';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(correlationIdMiddleware);
app.use(requestLoggingMiddleware);
app.use('/api', routes);

const PORT = Number(process.env.PORT) || 8876;
const server = http.createServer(app);

AppDataSource.initialize()
  .then(() => {
    setupSwagger(app);
    connectMqttPublisher();
    attachLikeWebSocket(server);
    server.listen(PORT, () => {
      logger.info('posts.api.started', {
        port: PORT,
        wsPath: '/ws',
        mqttTopic: getMqttLikesTopic(),
        mqttUrl: process.env.MQTT_URL || 'mqtt://localhost:1883',
      });
    });
  })
  .catch((err) => {
    logger.error('posts.api.db_init_failed', { error: String(err) });
    process.exit(1);
  });
