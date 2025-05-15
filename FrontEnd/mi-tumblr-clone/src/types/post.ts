import { User } from './user'

export interface Post {
  id: string
  content: string
  imageUrl?: string | null
  likesCount: number
  likedBy: string[] // Array of user IDs who liked the post
  createdAt: string
  updatedAt: string
  user: Partial<User> // User object for the post author
}

export interface CreatePostData {
  content: string
  imageUrl?: string
}

export interface UpdatePostData {
  content?: string
  imageUrl?: string | null // Allow unsetting imageUrl
} 