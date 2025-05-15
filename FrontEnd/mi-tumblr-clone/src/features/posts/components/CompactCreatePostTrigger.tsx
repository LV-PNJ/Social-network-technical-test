import React from 'react';
import { Box, Paper, Typography, Avatar, useTheme } from '@mui/material';
import { UseAuth } from '@/hooks/UseAuth'; // Adjust the import path as necessary
import AddIcon from '@mui/icons-material/AddCircleOutline'; // Or any other icon you prefer

interface CompactCreatePostTriggerProps {
  onTriggerClick: () => void;
}

const CompactCreatePostTrigger: React.FC<CompactCreatePostTriggerProps> = ({ onTriggerClick }) => {
  const { currentUser } = UseAuth();
  const theme = useTheme();

  return (
    <Paper
      elevation={2} // Subtle elevation
      onClick={onTriggerClick}
      sx={{
        p: 2,
        mb: 3, // Margin bottom to separate from post list
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: theme.palette.background.paper, // Use theme's paper color (dark in dark mode)
        borderRadius: '8px', // Rounded corners
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: theme.shadows[4],
          // backgroundColor: theme.palette.action.hover, // Optional: slight hover effect
        },
        maxWidth: 700, // Match the width of the post feed
        mx: 'auto',     // Center it if it's narrower than HomePage content area
      }}
    >
      {currentUser && (
        <Avatar
          src={currentUser.avatarUrl || currentUser.avatar || 'https://i.pravatar.cc/150?u=default'}
          alt={currentUser.username}
          sx={{ width: 40, height: 40, mr: 2, border: `2px solid ${theme.palette.primary.main}` }}
        />
      )}
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary, // Lighter text as placeholder
          flexGrow: 1,
        }}
      >
        Crea una publicación...
      </Typography>
      <AddIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
    </Paper>
  );
};

export default CompactCreatePostTrigger; 