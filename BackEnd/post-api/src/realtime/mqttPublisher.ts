import mqtt, { type MqttClient } from 'mqtt';
import { logger } from '../helpers/logger';
import type { LikeRealtimeEvent } from './likeEvents';

const DEFAULT_TOPIC = 'devexp/posts/likes';

let client: MqttClient | null = null;
let topic = DEFAULT_TOPIC;

export function getMqttLikesTopic(): string {
  return topic;
}

/**
 * Connects Posts API as MQTT publisher.
 * Broker URL examples:
 * - mqtt://mqtt:1883 (compose)
 * - mqtt://localhost:1883 (local)
 */
export function connectMqttPublisher(): void {
  const url = process.env.MQTT_URL || 'mqtt://localhost:1883';
  topic = process.env.MQTT_LIKES_TOPIC || DEFAULT_TOPIC;

  client = mqtt.connect(url, {
    clientId: `posts-api-publisher-${process.pid}`,
    clean: true,
    reconnectPeriod: 2000,
    connectTimeout: 10_000,
  });

  client.on('connect', () => {
    logger.info('mqtt.publisher.connected', { url, topic });
  });

  client.on('reconnect', () => {
    logger.warn('mqtt.publisher.reconnect', { url });
  });

  client.on('error', (err) => {
    logger.error('mqtt.publisher.error', { error: String(err) });
  });

  client.on('close', () => {
    logger.warn('mqtt.publisher.closed', {});
  });
}

export function publishLikeEvent(event: LikeRealtimeEvent): void {
  if (!client || !client.connected) {
    logger.warn('mqtt.publish.skipped', {
      reason: 'not_connected',
      postId: event.postId,
      eventId: event.eventId,
    });
    return;
  }

  const payload = JSON.stringify(event);
  client.publish(topic, payload, { qos: 1, retain: false }, (err) => {
    if (err) {
      logger.error('mqtt.publish.failed', {
        error: String(err),
        postId: event.postId,
        eventId: event.eventId,
      });
      return;
    }
    logger.info('mqtt.publish.ok', {
      topic,
      postId: event.postId,
      action: event.action,
      eventId: event.eventId,
      qos: 1,
    });
  });
}
