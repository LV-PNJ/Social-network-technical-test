// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import PostList from '../features/posts/components/PostList';
import CreatePostForm from '../features/posts/components/CreatePostForm';
import { mockPosts, mockUsers } from '../data/mockData'; // Usaremos los mocks
import type { Post, User, Comment as CommentType } from '../utils';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, CircularProgress } from '@mui/material';
import PostCard from '@/components/ui/PostCard';
import { getPosts } from '@/features/posts/services/postService';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleAddPost = (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'createdAt' | 'userId'> & { type: Post['type'] }) => {
    if (!currentUser) return;

    const newPost: Post = {
      id: `post${Date.now()}`, // ID único simple
      userId: currentUser.id,
      author: currentUser,
      ...postData,
      likes: [],
      comments: [],
      createdAt: new Date(),
    };
    // Añadir al inicio de la lista para verla primero
    setPosts(prevPosts => [newPost, ...prevPosts]);
    mockPosts.unshift(newPost); // Actualizar el mock (no persistirá en recargas sin backend)
  };

  const handleLikePost = (postId: string) => {
    if (!currentUser) return;
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const alreadyLiked = p.likes.includes(currentUser.id);
          return {
            ...p,
            likes: alreadyLiked
              ? p.likes.filter(userId => userId !== currentUser.id)
              : [...p.likes, currentUser.id],
          };
        }
        return p;
      })
    );
    // Actualizar mockData (para consistencia si se navega y vuelve)
    const postIndex = mockPosts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
        const alreadyLiked = mockPosts[postIndex].likes.includes(currentUser.id);
        mockPosts[postIndex].likes = alreadyLiked
            ? mockPosts[postIndex].likes.filter(userId => userId !== currentUser.id)
            : [...mockPosts[postIndex].likes, currentUser.id];
    }
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!currentUser) return;
    const newComment: CommentType = {
      id: `comment${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      text: commentText,
      createdAt: new Date(),
    };

    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    // Actualizar mockData
    const postIndex = mockPosts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
        mockPosts[postIndex].comments.push(newComment);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Inicio</h1>
      {currentUser && <CreatePostForm onAddPost={handleAddPost} />}
      {posts.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          No posts yet. Be the first to create one!
        </Typography>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default HomePage;