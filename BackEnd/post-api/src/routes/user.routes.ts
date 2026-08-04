import { Router } from 'express';
import { listPostsByUser } from '../controllers/post.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User related endpoints
 */

/**
 * @openapi
 * /users/{userId}/posts:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get posts by user ID
 *     description: Retrieve all posts created by a specific user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose posts are to be retrieved.
 *     responses:
 *       200:
 *         description: A list of posts by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 statusMessage:
 *                   type: string
 *                   example: "OK"
 *                 statusDescription:
 *                   type: string
 *                   example: "Request successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Posts by user retrieved successfully"
 *                     internalCode:
 *                       type: string
 *                       example: "LIST_BY_USER"
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post' 
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No posts found for this user or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:userId/posts', verifyToken, listPostsByUser);

export default router; 