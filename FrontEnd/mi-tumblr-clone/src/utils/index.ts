// src/types/index.ts
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string; // Para mostrar fácilmente
  text: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  author: User; // Información del autor
  type: 'text' | 'image'; // Tipos de post como Tumblr
  title?: string;
  content: string; // Puede ser texto, URL de imagen, etc.
  tags?: string[];
  likes: string[]; // Array de userIds que dieron like
  comments: Comment[];
  createdAt: Date;
  rebloggedFrom?: Post; // Para la funcionalidad de reblogueo
}