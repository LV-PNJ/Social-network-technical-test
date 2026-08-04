import { Options } from 'swagger-jsdoc';
import path from 'path';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PostApi — DEVEXP',
      version: '1.0.0',
      description:
        'Posts, likes (REST) and MQTT publish. Auth JWT is issued by Identity; PostApi only verifies RS256.',
    },
    servers: [
      {
        url: 'http://localhost:8876/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 400 },
            statusMessage: { type: 'string', example: 'Bad Request' },
            statusDescription: {
              type: 'string',
              example: 'Request is invalid, missing parameters?',
            },
            data: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Validation failed' },
              },
            },
          },
        },
        PostAuthor: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            username: { type: 'string', example: 'demo' },
            avatar: { type: 'string', nullable: true },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            likedBy: {
              type: 'array',
              items: { type: 'string', format: 'uuid' },
            },
            user: { $ref: '#/components/schemas/PostAuthor' },
          },
        },
        PostResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 200 },
            data: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string' },
                post: { $ref: '#/components/schemas/Post' },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js'),
  ],
};
