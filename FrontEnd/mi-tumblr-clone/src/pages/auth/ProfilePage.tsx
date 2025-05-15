import { useGetPostsByUserIdQuery } from '@/features/posts/postApiSlice';
import { UseAuth } from '@/hooks/UseAuth'; 
import PostList from '../../features/posts/components/PostList';
import { Box, Typography, CircularProgress, Paper, Avatar as MuiAvatar, useTheme, Divider } from '@mui/material';

const ProfilePage: React.FC = () => {
  const { currentUser } = UseAuth();
  const theme = useTheme();

  const userIdToFetch = currentUser?.id;

  const { data: userPosts, isLoading: isPostsLoading, error: postsError } = useGetPostsByUserIdQuery(userIdToFetch!, {
    skip: !userIdToFetch,
  });

  const handleLikePost = (postId: string) => {
    if (!currentUser) return;
    console.log('Like post on profile page:', postId);
  };

  if (!currentUser && !isPostsLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="text.secondary">
          Usuario no autenticado o no encontrado.
        </Typography>
      </Box>
    );
  }
  
  if (isPostsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (postsError) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography color="error">Error al cargar las publicaciones del usuario.</Typography>
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="text.secondary">
          Sesión expirada o usuario no disponible.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, maxWidth: 900, mx: 'auto' }}>
      <Paper 
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          mb: 5,
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: 'center',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '12px',
        }}
      >
        <MuiAvatar
          src={currentUser.avatarUrl || currentUser.avatar || 'https://i.pravatar.cc/150?u=default'}
          alt={currentUser.username}
          sx={{
            width: { xs: 100, sm: 120, md: 150 },
            height: { xs: 100, sm: 120, md: 150 },
            mr: { sm: 4, md: 5 },
            mb: { xs: 3, sm: 0 },
            border: `5px solid ${theme.palette.primary.dark}`,
            boxShadow: theme.shadows[3],
          }}
        />
        <Box textAlign={{ xs: 'center', sm: 'left' }} sx={{width: '100%'}}>
          <Typography variant="h3" component="h1" fontWeight={800} sx={{color: theme.palette.text.primary}} gutterBottom>
            {currentUser.username}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{mb: currentUser.bio ? 1.5 : 0}}>
            {currentUser.email}
          </Typography>
          {currentUser.bio && (
            <>
              <Divider sx={{ my: 1.5, borderColor: theme.palette.divider }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {currentUser.bio}
              </Typography>
            </>
          )}
        </Box>
      </Paper>

      <Typography 
        variant="h4"
        component="h2" 
        fontWeight={700}
        gutterBottom 
        sx={{ 
          color: theme.palette.text.primary, 
          mb: 4,
          pb: 1,
          borderBottom: `3px solid ${theme.palette.primary.main}`,
          display: 'inline-block',
        }}
      >
        Mis Publicaciones
      </Typography>
      
      {(!userPosts || userPosts.length === 0) && !isPostsLoading ? (
        <Typography variant="subtitle1" color="text.secondary" textAlign="center">
          Aún no has creado ninguna publicación.
        </Typography>
      ) : (
        <PostList posts={userPosts || []} onLike={handleLikePost} onAddComment={() => {}} />
      )}
    </Box>
  );
};

export default ProfilePage; 