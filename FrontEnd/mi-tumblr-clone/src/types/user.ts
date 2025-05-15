export interface User {
  id?: string | null;
  username?: string | null;
  email?: string | null;
  displayName?: string | null;
  avatar?: string | null;
  bio?: string | null;
  following?: string[] | null;
  followers?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}


export interface UserLoginData {
  user: string
  password: string
}

export interface UserRegistrationData {
  username: string
  email: string
  password: string
  displayName?: string
} 