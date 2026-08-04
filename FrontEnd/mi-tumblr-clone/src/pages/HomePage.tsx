import React from 'react';
import { UseAuth } from '@/hooks/UseAuth';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import PostCard from '@/components/ui/PostCard';
import { useGetPostsQuery, useDeletePostMutation } from '@/features/posts/postApiSlice';
import { Post } from '@/types/post';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CompactCreatePostTrigger from '@/features/posts/components/CompactCreatePostTrigger';
import { mapPostsError } from '@/utils/errorMessages';

interface HomePageOutletContext {
  handleOpenCreatePostModal: () => void;
}

const HomePage: React.FC = () => {
  const { currentUser } = UseAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { handleOpenCreatePostModal } = useOutletContext<HomePageOutletContext>();

  const { data: posts, isLoading, isError, error } = useGetPostsQuery({
    page: 1,
    size: 20,
  });

  const [deletePost] = useDeletePostMutation();

  const handleEditPost = (postToEdit: Post) => {
    navigate(`/edit-post/${postToEdit.id}`);
  };

  const handleDeletePost = async (postToDelete: Post) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postToDelete.id).unwrap();
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert(mapPostsError(err));
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

      {currentUser && handleOpenCreatePostModal && (
        <CompactCreatePostTrigger onTriggerClick={handleOpenCreatePostModal} />
      )}

      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '30vh',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
      {isError && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '30vh',
            flexDirection: 'column',
            px: 2,
          }}
        >
          <Typography color="warning.main" textAlign="center">
            {mapPostsError(error)}
          </Typography>
        </Box>
      )}

      {!isLoading && !isError && (!posts || posts.length === 0) && (
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ color: theme.palette.text.secondary, mt: 4 }}
        >
          No hay publicaciones todavía. ¡Sé el primero en crear una!
        </Typography>
      )}

      {!isLoading && !isError && posts && posts.length > 0 && (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          {posts.map((post) =>
            post && post.id ? (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ) : null
          )}
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
