import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '@/features/authentication/services/userApiSlice';
import { UserRegistrationData } from '@/types/user';
import { setStoredToken, setStoredUser } from '@/utils/storage';
import { UseAuth } from '@/context/AuthContext';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { checkAuthStatus } = UseAuth();
  const [error, setError] = useState('');
  const [registerUserMutation, { isLoading }] = useRegisterUserMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const registrationData: UserRegistrationData = { username, email, password };

    try {
      const result = await registerUserMutation(registrationData).unwrap();

      if (result.status && result.data?.token && result.data?.user) {
        setStoredToken(result.data.token);
        setStoredUser(result.data.user);
        if (checkAuthStatus) await checkAuthStatus();
        navigate('/');
      } else {
        setError(result.statusDescription || 'Registration failed. Unexpected response.');
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(
        err.data?.statusDescription ||
        err.data?.error ||
        err.message ||
        'An unknown error occurred during registration.'
      );
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        Sign up for DevX
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          disabled={isLoading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" variant="body2">
            {'Already have an account? Log in'}
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}
