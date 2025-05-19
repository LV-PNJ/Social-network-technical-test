import { Request, Response } from 'express';
import { AppDataSource } from '../config/dbConfig';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { formatResponse } from '../helpers/formatResponse';
import { errorFormat } from '../helpers/errors';

// Helper to format post output consistently
const formatPostOutput = (post: Post | null, currentUser?: User) => {
  if (!post) return null;
  const postUser = post.user || currentUser;
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    likedBy: post.likedBy || [],
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    user: postUser ? {
      id: postUser.id,
      username: postUser.username,
      avatar: postUser.avatar
    } : undefined,
  };
};

// Create
export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, imageUrl } = req.body;
    const user = req.user! as User;

    const post = new Post();
    post.content = content;
    if (imageUrl) post.imageUrl = imageUrl;
    post.user = user;
    post.likedBy = [];

    const savedPost = await AppDataSource.getRepository(Post).save(post);
    const reloadedPost = await AppDataSource.getRepository(Post).findOne({where: {id: savedPost.id}, relations: ['user']});

    return res.status(201).json(
      formatResponse(201, {
        message: 'Post created successfully',
        internalCode: 'POST',
        post: formatPostOutput(reloadedPost, user)
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
      order: { createdAt: 'DESC' }
    });

    return res.status(200).json(
      formatResponse(200, {
        message: 'Posts retrieved successfully',
        internalCode: 'LIST',
        posts: posts.map(post => formatPostOutput(post))
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
    const postFromMiddleware = req.post!;
    const post = await AppDataSource.getRepository(Post).findOne({
        where: { id: postFromMiddleware.id },
        relations: ['user']
    });

    if (!post) {
        return res.status(404).json(formatResponse(404, errorFormat({status: 404, message: 'Post not found'})));
    }

    return res.status(200).json(
      formatResponse(200, {
        message: 'Post retrieved successfully',
        internalCode: 'GET',
        post: formatPostOutput(post)
      })
    );
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

// Read (List posts by user)
export const listPostsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const posts = await AppDataSource.getRepository(Post).find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });

    if (!posts) {
      return res.status(404).json(
        formatResponse(404, errorFormat({ status: 404, message: 'No posts found for this user' }))
      );
    }

    return res.status(200).json(
      formatResponse(200, {
        message: 'Posts by user retrieved successfully',
        internalCode: 'LIST_BY_USER',
        posts: posts.map(post => formatPostOutput(post))
      })
    );
  } catch (error) {
    console.error('List posts by user error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

// Update
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { content, imageUrl } = req.body;
    const postToUpdate = req.post!;

    postToUpdate.content = content;
    if (imageUrl !== undefined) postToUpdate.imageUrl = imageUrl;
    
    await AppDataSource.getRepository(Post).save(postToUpdate);
    const reloadedPost = await AppDataSource.getRepository(Post).findOne({ where: { id: postToUpdate.id }, relations: ['user'] });

    return res.status(200).json(
      formatResponse(200, {
        message: 'Post updated successfully',
        internalCode: 'UPD',
        post: formatPostOutput(reloadedPost)
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
    const postToLike = req.post!;
    const user = req.user! as User;

    if (!postToLike.likedBy) postToLike.likedBy = [];
    if (!postToLike.likedBy.includes(user.id)) {
      postToLike.likedBy.push(user.id);
    } 

    await AppDataSource.getRepository(Post).save(postToLike);
    const reloadedPost = await AppDataSource.getRepository(Post).findOne({ where: { id: postToLike.id }, relations: ['user'] });

    return res.status(200).json(
      formatResponse(200, {
        message: 'Post liked successfully',
        internalCode: 'LIKE',
        post: formatPostOutput(reloadedPost)
      })
    );
  } catch (error) {
    console.error('Like post error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

// Unlike post
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const postToUnlike = req.post!;
    const user = req.user! as User;

    if (!postToUnlike.likedBy) postToUnlike.likedBy = [];
    const userIndex = postToUnlike.likedBy.indexOf(user.id);
    if (userIndex > -1) {
      postToUnlike.likedBy.splice(userIndex, 1);
    } 

    await AppDataSource.getRepository(Post).save(postToUnlike);
    const reloadedPost = await AppDataSource.getRepository(Post).findOne({ where: { id: postToUnlike.id }, relations: ['user'] });

    return res.status(200).json(
      formatResponse(200, {
        message: 'Post unliked successfully',
        internalCode: 'UNLIKE',
        post: formatPostOutput(reloadedPost)
      })
    );
  } catch (error) {
    console.error('Unlike post error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};
