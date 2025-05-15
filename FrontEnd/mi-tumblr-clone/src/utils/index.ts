// src/types/index.ts
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Post {
  id: string;
  userId: string;
  type: 'text' | 'image'; // Tipos de post como Tumblr
  title?: string;
  content: string; // Puede ser texto, URL de imagen, etc.
  likes: string[]; // Array de userIds que dieron like
  createdAt: Date;
}