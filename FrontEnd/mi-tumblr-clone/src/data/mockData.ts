// src/data/mockData.ts
import type { User, Post } from "../utils"
export const mockUsers: User[] = [
  { id: 'user1', username: 'Alice', email: 'alice@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=alice', bio: 'Blogger y entusiasta de la tecnología.' },
  { id: 'user2', username: 'Bob', email: 'bob@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=bob', bio: 'Fotógrafo aficionado.' },
];

export const mockPosts: Post[] = [
  {
    id: 'post1',
    userId: 'user1',
    author: mockUsers[0],
    type: 'text',
    title: 'Mi primer post',
    content: '¡Hola mundo! Este es mi primer post en esta plataforma.',
    tags: ['introduccion', 'hola'],
    likes: ['user2'],
    comments: [
      { id: 'comment1', userId: 'user2', username: 'Bob', text: '¡Bienvenido!', createdAt: new Date() }
    ],
    createdAt: new Date(Date.now() - 3600 * 1000 * 24), // Hace 1 día
  },
  {
    id: 'post2',
    userId: 'user2',
    author: mockUsers[1],
    type: 'image',
    title: 'Atardecer en la playa',
    content: 'https://picsum.photos/seed/beach/600/400', // URL de una imagen de ejemplo
    tags: ['fotografia', 'naturaleza', 'playa'],
    likes: ['user1'],
    comments: [],
    createdAt: new Date(Date.now() - 3600 * 1000 * 2), // Hace 2 horas
  },
  {
    id: 'post3',
    userId: 'user1',
    author: mockUsers[0],
    type: 'quote',
    content: 'La imaginación es más importante que el conocimiento.',
    tags: ['inspiracion', 'citas'],
    likes: [],
    comments: [],
    createdAt: new Date(),
  }
];