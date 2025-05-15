import React from 'react';
import CreatePostForm from '../features/posts/components/CreatePostForm';
import { UseAuth } from '../context/AuthContext';
import { Box, Typography, CircularProgress } from '@mui/material';
import PostCard from '@/components/ui/PostCard';
import { useGetPostsQuery, useDeletePostMutation, useCreatePostMutation } from '@/features/posts/postApiSlice'; // RTK Query hook
import { Post } from '@/types/post'; 
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { currentUser } = UseAuth();
  const navigate = useNavigate();
  
  // Use RTK Query hook to fetch posts
  const { 
    data: posts, 
    isLoading, 
    isError, 
    error 
  } = useGetPostsQuery();

  console.log("HomePage: Posts data from API:", posts);
  console.log("HomePage: IsLoading:", isLoading, "IsError:", isError, "Error object:", error);

  const [deletePost] = useDeletePostMutation();
  const [createPost] = useCreatePostMutation();

  const handleEditPost = (postToEdit: Post) => {
    navigate(`/edit-post/${postToEdit.id}`);
  };

  const handleDeletePost = async (postToDelete: Post) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postToDelete.id).unwrap();
        // List will update due to tag invalidation
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert(`Failed to delete post: ${(err as any)?.data?.message || (err as any)?.error || 'Unknown error'}`);
      }
    }
  };

  const handleAddPost = async (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'createdAt' | 'userId'> & { type: Post['type'] }) => {
    try {
      await createPost(postData).unwrap();
    } catch (err) {
      console.error('Failed to add post:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Inicio</h1>
      {currentUser && <CreatePostForm onAddPost={handleAddPost} />}
      
      {isLoading && (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
           <CircularProgress />
         </Box>
      )}
      {isError && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
          <Typography color="error">Error al cargar posts: {(error as any)?.data?.message || (error as any)?.error || 'Error desconocido'}</Typography>
        </Box>
      )}
      
      {!isLoading && !isError && (!posts || posts.length === 0) && (
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
          No hay publicaciones todavía. ¡Sé el primero en crear una!
        </Typography>
      )}

      {!isLoading && !isError && posts && posts.length > 0 && (
        posts.map((post) => (
          post && post.id ? (
            <PostCard 
              key={post.id} 
              post={post} 
              onEdit={handleEditPost} 
              onDelete={handleDeletePost} 
            />
          ) : (
            <Typography key={Math.random()} color="error">Error: Post inválido o sin ID.</Typography>
          )
        ))
      )}
    </div>
  );
};

export default HomePage;