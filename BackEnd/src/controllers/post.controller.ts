import { Request, Response } from 'express';
import { AppDataSource } from '../config/dbConfig';
import { Post } from '../models/Post';
import { formatResponse } from '../helpers/formatResponse';
import { errorFormat } from '../helpers/errors';

// Create
export const createPost = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const user = req.user!;

    const post = new Post();
    post.content = content;
    post.user = user;

    const savedPost = await AppDataSource.getRepository(Post).save(post);
    return res.status(201).json(
      formatResponse(201, {
        message: 'Post created successfully',
        internalCode: 'POST',
        post: {
          id: savedPost.id,
          content: savedPost.content,
          likes: savedPost.likes,
          user: {
            id: user.id,
            username: user.username
          }
        }
      })
    );
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

// Read (List all)
export const listPosts = async (_: Request, res: Response) => {
  try {
    const posts = await AppDataSource.getRepository(Post).find({ 
      relations: ['user'],
      order: { id: 'DESC' } 
    });

    return res.status(200).json(
      formatResponse(200, {
        message: 'Posts retrieved successfully',
        internalCode: 'LIST',
        posts: posts.map(post => ({
          id: post.id,
          content: post.content,
          likes: post.likes,
          user: {
            id: post.user.id,
            username: post.user.username
          }
        }))
      })
    );
  } catch (error) {
    console.error('List posts error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

// Read (Get one)
export const getPost = async (req: Request, res: Response) => {
  try {
    // El post ya fue validado y está disponible gracias al middleware
    const post = req.post!;

    return res.status(200).json(
      formatResponse(200, {
        message: 'Post retrieved successfully',
        internalCode: 'GET',
        post: {
          id: post.id,
          content: post.content,
          likes: post.likes,
          user: {
            id: post.user.id,
            username: post.user.username
          }
        }
      })
    );
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

// Update
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const post = req.post!;

    post.content = content;
    const updatedPost = await AppDataSource.getRepository(Post).save(post);

    return res.status(200).json(
      formatResponse(200, {
        message: 'Post updated successfully',
        internalCode: 'UPD',
        post: {
          id: updatedPost.id,
          content: updatedPost.content,
          likes: updatedPost.likes,
          user: {
            id: post.user.id,
            username: post.user.username
          }
        }
      })
    );
  } catch (error) {
    console.error('Update post error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

// Delete
export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = req.post!;
    await AppDataSource.getRepository(Post).remove(post);

    return res.status(200).json(
      formatResponse(200, {
        message: 'Post deleted successfully',
        internalCode: 'DEL',
        postId: post.id
      })
    );
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

// Like post
export const likePost = async (req: Request, res: Response) => {
  try {
    const post = req.post!;
    post.likes += 1;

    const updatedPost = await AppDataSource.getRepository(Post).save(post);

    return res.status(200).json(
      formatResponse(200, {
        message: 'Post liked successfully',
        internalCode: 'LIKE',
        post: {
          id: updatedPost.id,
          content: updatedPost.content,
          likes: updatedPost.likes,
          user: {
            id: post.user.id,
            username: post.user.username
          }
        }
      })
    );
  } catch (error) {
    console.error('Like post error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};
