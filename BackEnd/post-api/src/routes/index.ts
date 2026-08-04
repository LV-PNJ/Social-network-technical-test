import { Router } from 'express';
import postRoutes from './post.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/posts', postRoutes);

export default router;
