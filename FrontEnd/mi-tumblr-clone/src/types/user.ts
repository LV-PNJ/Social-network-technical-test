export interface User {
  id: string
  username: string
  email: string
  displayName?: string
  avatar?: string
  bio?: string
  following?: string[]
  followers?: string[]
  createdAt: string
  updatedAt: string
}

export interface UserLoginData {
  email: string
  password: string
}

export interface UserRegistrationData {
  username: string
  email: string
  password: string
  displayName?: string
} 