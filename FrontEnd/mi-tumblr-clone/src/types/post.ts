import { User } from './user'

export interface Post {
  id: string
  content: string
  imageUrl?: string
  author?: User
  likes?: string[] // Array of user IDs who liked the post
  comments?: Comment[]
  createdAt?: string
  updatedAt?: string
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
  updatedAt: string
}

export interface CreatePostData {
  content: string
  imageUrl?: string
}

export interface UpdatePostData {
  content?: string
  imageUrl?: string
}

export interface CreateCommentData {
  content: string
  postId: string
} 