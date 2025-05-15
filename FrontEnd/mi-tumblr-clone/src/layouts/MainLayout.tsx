// src/layouts/MainLayout.tsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { UseAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Box, Container } from '@mui/material';
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';

const MainLayout: React.FC = () => {
  const { currentUser, logout } = UseAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 9 },
          pb: { xs: 8, sm: 9 },
          px: { xs: 2, sm: 3 },
          mt: '64px', // Height of navbar
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;


