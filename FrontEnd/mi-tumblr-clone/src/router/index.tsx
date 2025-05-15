// src/router/index.tsx
import React from 'react';
import type { ReactElement } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProfilePage from '../pages/auth/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

// Componente que devuelve las rutas
const AppRoutes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: 'profile/:userId',
          element: <ProfilePage />,
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};


export const createAppRouter = () => createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <NotFoundPage />, // Error boundary para rutas anidadas
      children: [
        { index: true, element: <HomePage /> },
        {
          path: 'profile/:userId',
          element: <ProfilePage />,
        },
        // {
        //   path: 'settings',
        //   element: (
        //     <ProtectedRoute>
        //       <SettingsPage />
        //     </ProtectedRoute>
        //   ),
        // },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
        path: '*', // Cualquier otra ruta no definida
        element: <NotFoundPage />
    }
  ]);

export default AppRoutes;
