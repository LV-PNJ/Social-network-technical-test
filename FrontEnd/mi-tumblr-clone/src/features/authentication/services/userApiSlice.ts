import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, UserLoginData, UserRegistrationData } from '../../../types/user';
import { getStoredToken } from '@/utils/storage'; 

const API_BASE_URL = import.meta.env.VITE_API_URL;
// Define a service using a base URL and expected endpoints
export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => { 
      const token = getStoredToken(); 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ token: string; user: User }, UserLoginData>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: { data: { token: string; user: User } }) => {
        return {
            status: true,
            statusDescription: 'Login successful.',
            data: response.data
          };
      },
      transformErrorResponse: (response) => response?.data || { status: false, statusDescription: 'Login failed.', error: (response?.data as any)?.message || 'Unknown error' },
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    registerUser: builder.mutation<{ token: string; user: User }, UserRegistrationData>({
      query: (userInfo) => ({
        url: 'auth/register',
        method: 'POST',
        body: userInfo,
      }),
      transformResponse: (response: { data: { token: string; user: User } }) => ({
        status: true,
        statusDescription: 'Registration successful.',
        data: response.data
      }),
      transformErrorResponse: (response) => response?.data || { status: false, statusDescription: 'Registration failed.', error: (response?.data as any)?.message || 'Unknown error' },
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => 'auth/me',
      transformResponse: (response: { data: User }) => {
        console.log("userApiSlice: getCurrentUser transformResponse input:", response);
        const user = response.data;
        
        if (!user) {
          console.error("userApiSlice: User object not found in response.data. Full response.data was:", response.data);
          return { 
            status: false, 
            statusDescription: 'User data format incorrect in response.', 
            data: null as any
          };
        }

        console.log("userApiSlice: Extracted user:", user);
        return {
          status: true,
          statusDescription: 'User data fetched successfully.',
          data: user,
        };
      },
      transformErrorResponse: (response) => {
        console.error("userApiSlice: getCurrentUser transformErrorResponse:", response);
        return response?.data || { status: false, statusDescription: 'Failed to fetch user data.', error: (response?.data as any)?.message || 'Unknown error' };
      },
      providesTags: [{ type: 'User', id: 'ME' }],
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: patch,
      }),
      transformResponse: (response: { data: User }) => ({
        status: true,
        statusDescription: 'User updated successfully.',
        data: response.data,
      }),
      transformErrorResponse: (response) => response?.data || { status: false, statusDescription: 'Failed to update user.', error: (response?.data as any)?.message || 'Unknown error' },
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, { type: 'User', id: 'ME' }],
    }),
    getUserById: builder.query<User, string>({
        query: (userId) => `users/${userId}`,
        transformResponse: (response: { data: User }) => ({
            status: true,
            statusDescription: 'User data fetched successfully.',
            data: response.data,
          }),
        transformErrorResponse: (response) => response?.data || { status: false, statusDescription: 'Failed to fetch user data.', error: (response?.data as any)?.message || 'Unknown error' },
        providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any, meta, arg) => ({
        status: true,
        statusDescription: 'User deleted successfully.',
        data: { success: true, id: arg },
      }),
      transformErrorResponse: (response) => response?.data || { status: false, statusDescription: 'Failed to delete user.', error: (response?.data as any)?.message || 'Unknown error' },
      invalidatesTags: (result, error, id) => [{ type: 'User', id }, { type: 'User', id: 'ME' }, { type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useDeleteUserMutation,
} = userApiSlice; 