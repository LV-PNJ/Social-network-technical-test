// src/layouts/MainLayout.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UseAuth } from '@/hooks/UseAuth'; 
import { Box, Container, Dialog, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';
import CreatePostForm from '@/features/posts/components/CreatePostForm';
import { CreatePostData, PostType } from '@/types/post';
import CloseIcon from '@mui/icons-material/Close';
import { useCreatePostMutation } from '@/features/posts/postApiSlice';
import { useLikeRealtime } from '@/hooks/useLikeRealtime';

// Prop type for Navbar to accept the function to open modal
export interface NavbarProps {
  onOpenCreatePostModal: () => void;
}

// Prop types for CreatePostForm
export interface CreatePostFormModalProps {
  onAddPost: (postData: CreatePostData) => Promise<void>;
  onCloseModal: () => void;
  isSubmitting: boolean;
}

const MainLayout: React.FC = () => {
  const { currentUser } = UseAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  useLikeRealtime(Boolean(currentUser));

  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();

  const handleOpenCreatePostModal = () => {
    setCreatePostModalOpen(true);
  };

  const handleCloseCreatePostModal = () => {
    setCreatePostModalOpen(false);
  };

  const handleActualAddPost = async (postData: CreatePostData) => {
    if (!currentUser) {
      console.error("User not authenticated to create post");
      return;
    }
    try {
      console.log('Submitting post from modal:', postData);
      await createPost(postData).unwrap();
      handleCloseCreatePostModal();
    } catch (err) {
      console.error('Failed to create post from modal:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onOpenCreatePostModal={handleOpenCreatePostModal} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 9 },
          pb: { xs: 8, sm: 9 },
          px: { xs: 2, sm: 3 },
          mt: '64px',
        }}
      >
        <Container maxWidth="lg">
          <Outlet context={{ handleOpenCreatePostModal }} />
        </Container>
      </Box>

      <Dialog
        open={isCreatePostModalOpen}
        onClose={handleCloseCreatePostModal}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '550px',
            borderRadius: '8px',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[5],
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2, fontWeight:'bold' }}>
          Crear publicación
          <IconButton
            aria-label="close"
            onClick={handleCloseCreatePostModal}
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              color: theme.palette.text.secondary,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{pt: 1}}>
          <CreatePostForm 
            onAddPost={handleActualAddPost} 
            onCloseModal={handleCloseCreatePostModal} 
            isSubmitting={isCreatingPost} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MainLayout;


