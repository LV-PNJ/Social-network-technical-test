import { Routes, Route } from 'react-router-dom';
import { Box, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';
import EditPostPage from './pages/EditPostPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './router/PrivateRoute';
import ServiceStatusBanner from './components/ui/ServiceStatusBanner';

// Tumblr-like theme
const tumblrTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b8ff', // Tumblr blue for primary actions
    },
    background: {
      default: '#36465d', // Tumblr dark blue background
      paper: '#42506a',   // Darker paper for cards, forms, etc.
    },
    text: {
      primary: '#ffffff',   // White text on dark backgrounds
      secondary: '#cbd0d8', // Lighter gray for secondary text
    },
  },
  typography: {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          color: '#fff', // White text for dark paper backgrounds
          backgroundColor: '#42506a',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: '#42506a',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#42506a',
          color: '#fff',
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: '#42506a',
        },
        input: {
          color: '#fff',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={tumblrTheme}>
      <CssBaseline />
      <Box sx={{ height: '100%', bgcolor: 'background.default' }}>
        <ServiceStatusBanner />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/edit-post/:postId" element={<EditPostPage />} />
            </Route>
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;