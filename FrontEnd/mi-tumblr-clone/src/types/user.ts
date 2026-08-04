export interface User {
  id?: string | null;
  username?: string | null;
  alias?: string | null;
  email?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  birthDate?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  following?: string[] | null;
  followers?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UserLoginData {
  user: string;
  password: string;
}

export interface UserRegistrationData {
  alias: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}
