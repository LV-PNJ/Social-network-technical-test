import { Container, Box } from '@mui/material';
import RegisterForm from '../../features/authentication/components/RegisterForm';

export default function RegisterPage() {
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
        <RegisterForm />
      </Box>
    </Container>
  );
}
