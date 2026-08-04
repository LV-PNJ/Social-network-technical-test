import { User } from '../models/User';
import { Post } from '../models/Post';

declare global {
  namespace Express {
    interface Request {
      user?: User; // User model now has id: string
      post?: Post; // Post model now has id: string
    }
  }
} 