import { Request, Response } from 'express';
import { AppDataSource } from '../config/dbConfig';
import { User } from '../models/User';
import { signToken } from '../helpers/signToken';
import { formatResponse } from '../helpers/formatResponse';
import { errorFormat } from '../helpers/errors';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const repo = AppDataSource.getRepository(User);

    const newUser = repo.create({
      username,
      email,
      password,
    });

    await repo.save(newUser);

    // Sign a token for the new user
    const payload = {
      id: newUser.id,
      role: 'user', // Default role
      username: newUser.username,
      email: newUser.email,
    };
    const token = await signToken(payload);

    return res.status(201).json(
      formatResponse(201, {
        message: 'User created successfully',
        internalCode: 'REG',
        token: token, // Add token to response
        user: { id: newUser.id, username: newUser.username, email: newUser.email }
      })
    );
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // El usuario ya fue validado y está disponible gracias al middleware
    const user = req.user!;
    console.log('User found:', user);
    const payload = {
      id: user.id,
      role: 'user',
      username: user.username,
      email: user.email,
    };

    const token = await signToken(payload);

    return res.status(200).json(
      formatResponse(200, {
        message: 'Login successful',
        internalCode: 'LOG',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      })
    );
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // El usuario ya fue validado y está disponible gracias al middleware verifyToken
    // req.user es establecido por verifyToken
    const user = req.user;

    if (!user) {
      return res.status(401).json(
        formatResponse(401, errorFormat({ status: 401, message: 'User not authenticated' }))
      );
    }
    
    return res.status(200).json(
      formatResponse(200, {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        following: user.following,
        followers: user.followers,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    );
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json(
      formatResponse(500, errorFormat({ status: 500, message: 'Internal server error' }))
    );
  }
};
