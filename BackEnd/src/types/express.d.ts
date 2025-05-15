import { User } from '../models/User';
import { Post } from '../models/Post';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      post?: Post;
    }
  }
} 