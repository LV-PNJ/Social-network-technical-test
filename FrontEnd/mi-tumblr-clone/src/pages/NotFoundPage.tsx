// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage: React.FC = () => {
  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#0f2239">
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', maxWidth: 400 }}>
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h1" color="primary" fontWeight={700} gutterBottom sx={{ fontSize: 64 }}>
          404
        </Typography>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Página No Encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
        >
          Volver al Inicio
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;