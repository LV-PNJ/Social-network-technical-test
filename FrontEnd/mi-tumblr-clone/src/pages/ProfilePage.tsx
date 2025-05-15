
// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { User, Post } from '../utils';
import { mockUsers, mockPosts } from '../data/mockData';
import PostList from '../features/posts/components/PostList';
import { useAuth } from '../context/AuthContext';


const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth(); // Para el manejo de likes y comentarios
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    const foundUser = mockUsers.find(u => u.id === userId);
    setUser(foundUser || null);
    if (foundUser) {
      const posts = mockPosts.filter(p => p.userId === foundUser.id)
                             .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUserPosts(posts);
    }
  }, [userId]);

 // Las funciones handleLikePost y handleAddComment serían muy similares a las de HomePage.tsx
  // Podrías refactorizarlas en un custom hook o servicio si se vuelven muy repetitivas.
  // Por simplicidad, aquí las replicamos de forma básica.
  const handleLikePost = (postId: string) => {
    if (!currentUser) return;
    setUserPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const alreadyLiked = p.likes.includes(currentUser.id);
          // Actualizar también en mockPosts para consistencia global
          const globalPostIndex = mockPosts.findIndex(gp => gp.id === postId);
          if (globalPostIndex !== -1) {
            mockPosts[globalPostIndex].likes = alreadyLiked
              ? mockPosts[globalPostIndex].likes.filter(uid => uid !== currentUser.id)
              : [...mockPosts[globalPostIndex].likes, currentUser.id];
          }
          return {
            ...p,
            likes: alreadyLiked
              ? p.likes.filter(uid => uid !== currentUser.id)
              : [...p.likes, currentUser.id],
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!currentUser) return;
    const newComment = {
      id: `comment${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      text: commentText,
      createdAt: new Date(),
    };

    setUserPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
           // Actualizar también en mockPosts para consistencia global
          const globalPostIndex = mockPosts.findIndex(gp => gp.id === postId);
          if (globalPostIndex !== -1) {
            mockPosts[globalPostIndex].comments.push(newComment);
          }
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );
  };

  if (!user) {
    return <p className="text-center text-gray-500 mt-10">Usuario no encontrado.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col items-center sm:flex-row sm:items-start">
        <img
          src={user.avatarUrl || 'https://i.pravatar.cc/150?u=default'}
          alt={user.username}
          className="w-32 h-32 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 border-4 border-blue-500"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
          <p className="text-gray-600 mb-1">{user.email}</p>
          {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
          {/* Aquí podrías añadir botones para "Seguir", "Editar Perfil" si es el usuario actual, etc. */}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Publicaciones de {user.username}</h2>
      <PostList posts={userPosts} onLike={handleLikePost} onAddComment={handleAddComment} />
    </div>
  );
};

export default ProfilePage;
