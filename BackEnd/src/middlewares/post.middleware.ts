import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/dbConfig';
import { Post } from '../models/Post';
import { validate } from 'class-validator';
import { formatResponse } from '../helpers/formatResponse';
import { errorFormat } from '../helpers/errors';

// Extend Request type to include post
declare global {
  namespace Express {
    interface Request {
      post?: Post;
    }
  }
}

export const validatePostInput = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json(
        formatResponse(400, errorFormat({ status: 400, message: 'Content is required' }))
      );
    }

    // Crear una instancia de Post para validar con class-validator
    const post = new Post();
    post.content = content;
    post.user = req.user!;

    const errors = await validate(post);
    if (errors.length > 0) {
      const formErrors = errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints!)[0]
      }));
      return res.status(400).json(
        formatResponse(400, errorFormat({ status: 400, message: 'Validation failed', formErrors }))
      );
    }

    next();
  } catch (error) {
    console.error('Post validation error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

export const validatePostExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = +req.params.id;
    const post = await AppDataSource.getRepository(Post).findOne({
      where: { id: postId },
      relations: ['user']
    });

    if (!post) {
      return res.status(404).json(
        formatResponse(404, errorFormat({ status: 404, message: 'Post not found' }))
      );
    }

    // Adjuntar el post a la request para usarlo en otros middlewares/controllers
    req.post = post;
    next();
  } catch (error) {
    console.error('Post existence check error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

export const checkPostOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = req.post;
    const user = req.user;

    if (!post || !user) {
      return res.status(500).json(
        formatResponse(500, errorFormat({ status: 500, message: 'Internal server error - Missing post or user' }))
      );
    }

    if (post.user.id !== user.id) {
      return res.status(403).json(
        formatResponse(403, errorFormat({ status: 403, message: 'You can only modify your own posts' }))
      );
    }

    next();
  } catch (error) {
    console.error('Post ownership check error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
}; 