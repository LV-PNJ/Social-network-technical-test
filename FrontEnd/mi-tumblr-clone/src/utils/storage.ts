import { User } from '@/types/user'

const USER_STORAGE_KEY = 'devx_user'
const TOKEN_STORAGE_KEY = 'devx_token'

export function getStoredUser(): User | null {
  const userJson = localStorage.getItem(USER_STORAGE_KEY)
  return userJson ? JSON.parse(userJson) : null
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function removeStoredUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
} 