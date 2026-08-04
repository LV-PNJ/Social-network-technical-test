import { Router } from 'express';
import { getMe } from '../controllers/auth.controller';
import { validateRegisterInput, validateLoginInput } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account with username, email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *           example:
 *             username: "john_doe"
 *             email: "john@example.com"
 *             password: "Password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 statusMessage:
 *                   type: string
 *                   example: "Created"
 *                 statusDescription:
 *                   type: string
 *                   example: "Resource created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "User created successfully"
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', validateRegisterInput);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user (moved to Identity)
 *     deprecated: true
 */
router.post('/login', validateLoginInput);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user (moved to Identity)
 *     deprecated: true
 */
router.get('/me', getMe);

export default router; 