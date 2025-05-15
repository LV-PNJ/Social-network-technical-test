import { Container, Box, Paper, useTheme } from '@mui/material';
import RegisterForm from '../../features/authentication/components/RegisterForm';

export default function RegisterPage() {
  const theme = useTheme();

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
          elevation={6} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            width: '100%',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <RegisterForm />
        </Paper>
      </Box>
    </Container>
  );
}
