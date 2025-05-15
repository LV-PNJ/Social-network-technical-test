import { User } from '../models/User';
import { Post } from '../models/Post';
// Import Comment if/when it's created
// import { Comment } from '../models/Comment'; 

declare global {
  namespace Express {
    interface Request {
      user?: User; // User model now has id: string
      post?: Post; // Post model now has id: string
      // comment?: Comment; // For when Comment model is added
    }
  }
} 