import React from 'react';
import { UseAuth } from '@/hooks/UseAuth'; 
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import PostCard from '@/components/ui/PostCard';
import { useGetPostsQuery, useDeletePostMutation } from '@/features/posts/postApiSlice'; // Removed useCreatePostMutation
import { Post } from '@/types/post'; 
import { useNavigate, useOutletContext } from 'react-router-dom';
import CompactCreatePostTrigger from '@/features/posts/components/CompactCreatePostTrigger'; // Import the new component

// Define the type for the context passed from MainLayout
interface HomePageOutletContext {
  handleOpenCreatePostModal: () => void;
}

const HomePage: React.FC = () => {
  const { currentUser } = UseAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Get the function to open the modal from MainLayout's Outlet context
  const { handleOpenCreatePostModal } = useOutletContext<HomePageOutletContext>();

  const { 
    data: posts, 
    isLoading, 
    isError, 
    error 
  } = useGetPostsQuery();

  console.log("HomePage: Posts data from API:", posts);
  console.log("HomePage: IsLoading:", isLoading, "IsError:", isError, "Error object:", error);

  const [deletePost] = useDeletePostMutation();
  // CreatePost mutation is now handled by MainLayout, so no need for handleAddPost or useCreatePostMutation here

  const handleEditPost = (postToEdit: Post) => {
    navigate(`/edit-post/${postToEdit.id}`);
  };

  const handleDeletePost = async (postToDelete: Post) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postToDelete.id).unwrap();
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert(`Failed to delete post: ${(err as any)?.data?.message || (err as any)?.error || 'Unknown error'}`);
      }
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography 
        variant="h3" 
        fontWeight={900} 
        textAlign="center" 
        gutterBottom 
        sx={{ color: theme.palette.text.primary, letterSpacing: '1px' }}
      >
        Inicio
      </Typography>
      
      {/* Show CompactCreatePostTrigger if user is logged in */}
      {currentUser && handleOpenCreatePostModal && (
        <CompactCreatePostTrigger onTriggerClick={handleOpenCreatePostModal} />
      )}
      
      {isLoading && (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
           <CircularProgress color="primary"/>
         </Box>
      )}
      {isError && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', flexDirection: 'column' }}>
          <Typography color="error" sx={{ mb:1 }}>Error al cargar posts.</Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {(error as any)?.data?.message || (error as any)?.error || 'Error desconocido'}
          </Typography>
        </Box>
      )}
      
      {!isLoading && !isError && (!posts || posts.length === 0) && (
        <Typography variant="h6" textAlign="center" sx={{ color: theme.palette.text.secondary, mt: 4 }}>
          No hay publicaciones todavía. ¡Sé el primero en crear una!
        </Typography>
      )}

      {!isLoading && !isError && posts && posts.length > 0 && (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          {posts.map((post) => (
            post && post.id ? (
              <PostCard 
                key={post.id} 
                post={post} 
                onEdit={handleEditPost} 
                onDelete={handleDeletePost} 
              />
            ) : (
              <Typography key={Math.random()} color="error" sx={{my: 2, textAlign: 'center'}}>
                Error: Post inválido o sin ID.
              </Typography>
            )
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HomePage;