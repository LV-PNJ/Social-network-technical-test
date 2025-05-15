
import React from 'react';
import CreatePostForm from '../features/posts/components/CreatePostForm';
import { UseAuth } from '../context/AuthContext';
import { Box, Typography, CircularProgress } from '@mui/material';
import PostCard from '@/components/ui/PostCard';
import { useGetPostsQuery, useDeletePostMutation } from '@/features/posts/postApiSlice'; // RTK Query hook
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

  const [deletePost] = useDeletePostMutation();

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

  // Removed manual useEffect for fetching, handleAddPost, handleLikePost, handleAddComment

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    const errorMessage = (error as any)?.data?.message || (error as any)?.error || 'Failed to load posts.';
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <Typography color="error">Error: {errorMessage}</Typography>
        {/* Optionally, add a refetch button if your hook supports it or use refetch from the hook
            const { refetch } = useGetPostsQuery(); 
            <Button onClick={() => refetch()}>Try Again</Button> 
        */}
      </Box>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Inicio</h1>
      {currentUser && <CreatePostForm />}
      
      {(!posts || posts.length === 0) && !isLoading ? (
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
          No posts yet. Be the first to create one!
        </Typography>
      ) : (
        posts?.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onEdit={handleEditPost} 
            onDelete={handleDeletePost} 
          />
        ))
      )}
    </div>
  );
};

export default HomePage;