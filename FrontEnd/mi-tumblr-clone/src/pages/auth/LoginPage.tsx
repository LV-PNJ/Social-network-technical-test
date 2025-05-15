// src/pages/LoginPage.tsx
import { Container, Box, Paper } from '@mui/material';
import LoginForm from '../../features/authentication/components/LoginForm';

export default function LoginPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
}
