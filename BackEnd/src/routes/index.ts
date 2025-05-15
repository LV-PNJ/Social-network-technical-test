import { Router } from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import healthRoutes from './health.routes';

const router = Router();

/**
 * @openapi
 * /hello:
 *   get:
 *     tags:
 *       - Saludos
 *     summary: Saluda al usuario
 *     responses:
 *       200:
 *         description: Éxito
 */

// Health check route
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// Posts routes (protected)
router.use('/posts', postRoutes);

export default router;
