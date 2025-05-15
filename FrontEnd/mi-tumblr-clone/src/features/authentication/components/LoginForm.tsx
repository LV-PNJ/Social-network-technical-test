// src/components/LoginForm.tsx
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useLoginUserMutation } from '@/features/authentication/services/userApiSlice';
import { setStoredToken, setStoredUser } from '@/utils/storage';
import { UseAuth } from '@/hooks/UseAuth'; 
import { UserLoginData } from '@/types/user';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus } = UseAuth();
  const [error, setError] = useState('');
  const [loginUserMutation, { isLoading }] = useLoginUserMutation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const loginFieldValue = formData.get('email') as string;
    const password = formData.get('password') as string;

    const loginData: UserLoginData = { user: loginFieldValue, password };

    try {
      const result = await loginUserMutation(loginData).unwrap();
      if (result.status && result.data?.token && result.data?.user) {
        setStoredToken(result.data.token);
        setStoredUser(result.data.user);
        if (checkAuthStatus) await checkAuthStatus();
        navigate(from, { replace: true });
      } else {
        setError(result.statusDescription || 'Login failed. Unexpected response structure.');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(
        err.data?.statusDescription ||
        err.data?.error ||
        err.message ||
        'An unknown error occurred during login.'
      );
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        Log in to DevX
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
          id="email"
          label="Email or Username"
          name="email"
          autoComplete="email"
          autoFocus
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
          autoComplete="current-password"
          disabled={isLoading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Log In'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/register" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Box>
    </>
  );
}
