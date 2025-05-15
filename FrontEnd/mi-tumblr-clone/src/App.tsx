import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Box sx={{ height: '100%' }}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/edit-post/:postId" element={<EditPostPage />} />
          </Route>
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Box>
  );
}

export default App;