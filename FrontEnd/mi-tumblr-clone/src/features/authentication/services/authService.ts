import axios from 'axios'
import { User, UserLoginData, UserRegistrationData } from '@/types/user'
import { setStoredToken } from '@/utils/storage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8876/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function loginUser(data: UserLoginData): Promise<User> {
  try {
    const response = await api.post('/auth/login', data)
    const { user, token } = response.data.data
    // Almacenar el token en el almacenamiento local
    setStoredToken(token)
    return user
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to login')
    }
    throw new Error('Network error')
  }
}

export async function registerUser(data: UserRegistrationData): Promise<User> {
  try {
    const response = await api.post('/auth/register', data)
    const { user, token } = response.data
    setStoredToken(token)
    return user
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to register')
    }
    throw new Error('Network error')
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get('/auth/me')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get user data')
    }
    throw new Error('Network error')
  }
}


