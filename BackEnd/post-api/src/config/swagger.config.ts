import { Options } from 'swagger-jsdoc';
import path from 'path';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Network API',
      version: '1.0.0',
      description: 'API documentation for the Social Network application',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8876/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 400
            },
            statusMessage: {
              type: 'string',
              example: 'Bad Request'
            },
            statusDescription: {
              type: 'string',
              example: 'Request is invalid, missing parameters?'
            },
            data: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                message: {
                  type: 'string',
                  example: 'Validation failed'
                },
                formErrors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'username'
                      },
                      message: {
                        type: 'string',
                        example: 'Username is required'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              example: 1
            },
            username: {
              type: 'string',
              example: 'john_doe'
            },
            email: {
              type: 'string',
              example: 'john@example.com'
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              example: 1
            },
            content: {
              type: 'string',
              example: 'This is a great post about technology!'
            },
            likes: {
              type: 'number',
              example: 5
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        RegisterInput: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'john_doe',
              minLength: 3,
              maxLength: 30,
              pattern: '^[a-zA-Z0-9_]+$'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'Password123',
              minLength: 6,
              maxLength: 100
            }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'john_doe'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'Password123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 200
            },
            statusMessage: {
              type: 'string',
              example: 'OK'
            },
            statusDescription: {
              type: 'string',
              example: 'Request succeeded without error'
            },
            data: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                message: {
                  type: 'string',
                  example: 'Login successful'
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        PostResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 200
            },
            statusMessage: {
              type: 'string',
              example: 'OK'
            },
            statusDescription: {
              type: 'string',
              example: 'Request succeeded without error'
            },
            data: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                message: {
                  type: 'string',
                  example: 'Post created successfully'
                },
                post: {
                  $ref: '#/components/schemas/Post'
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js')
  ]
}; 