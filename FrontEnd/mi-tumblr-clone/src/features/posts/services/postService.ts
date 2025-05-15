import axios from 'axios'
import { Post, CreatePostData, UpdatePostData, CreateCommentData } from '@/types/post'
import { getStoredToken } from '@/utils/storage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8876/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function getPosts(): Promise<Post[]> {
  try {
    const response = await api.get('/posts')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch posts')
    }
    throw new Error('Network error')
  }
}

export async function getPost(id: string): Promise<Post> {
  try {
    const response = await api.get(`/posts/${id}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch post')
    }
    throw new Error('Network error')
  }
}

export async function createPost(data: CreatePostData): Promise<Post> {
  try {
    const response = await api.post('/posts', data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create post')
    }
    throw new Error('Network error')
  }
}

export async function updatePost(id: string, data: UpdatePostData): Promise<Post> {
  try {
    const response = await api.put(`/posts/${id}`, data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update post')
    }
    throw new Error('Network error')
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    await api.delete(`/posts/${id}`)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete post')
    }
    throw new Error('Network error')
  }
}

export async function likePost(id: string): Promise<Post> {
  try {
    const response = await api.post(`/posts/${id}/like`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to like post')
    }
    throw new Error('Network error')
  }
}

export async function unlikePost(id: string): Promise<Post> {
  try {
    const response = await api.delete(`/posts/${id}/like`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to unlike post')
    }
    throw new Error('Network error')
  }
}

export async function createComment(data: CreateCommentData): Promise<Post> {
  try {
    const response = await api.post(`/posts/${data.postId}/comments`, {
      content: data.content,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create comment')
    }
    throw new Error('Network error')
  }
} 