

export type PostType = 'text' | 'image' | 'quote';

export interface UserSummary {
  id: string;
  username: string;
  avatar?: string;
}

export interface Post {
  id: string;
  type: PostType;
  title?: string | null;
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  linkUrl?: string | null;
  quoteSource?: string | null;
  tags?: string[];
  user: UserSummary; 
  userId: string; 
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  likesCount: number;
  likedBy: string[]; // Array of user IDs who liked the post
}

// Para crear un post, no enviamos id, user, createdAt, etc.
export type CreatePostData = Omit<Post, 'id' | 'user' | 'userId' | 'createdAt' | 'updatedAt' | 'likesCount' | 'likedBy'>;

// Para actualizar un post
export type UpdatePostData = Partial<CreatePostData> & { id: string }; 