import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, UserLoginData, UserRegistrationData } from '../../../types/user';
import { getStoredToken } from '@/utils/storage';

const IDENTITY_URL =
  import.meta.env.VITE_IDENTITY_URL || 'http://localhost:8081/api';

type IdentityAuthResponse = {
  token: string;
  tokenType: string;
  expiresInMs: number;
  userId: string;
  alias: string;
};

type IdentityProfile = {
  id: string;
  alias: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
};

const toUser = (profile: IdentityProfile): User => ({
  id: profile.id,
  username: profile.alias,
  alias: profile.alias,
  email: profile.email,
  firstName: profile.firstName,
  lastName: profile.lastName,
  birthDate: profile.birthDate,
  displayName: `${profile.firstName} ${profile.lastName}`.trim(),
});

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: IDENTITY_URL,
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
    loginUser: builder.mutation<
      { status: boolean; statusDescription: string; data: { token: string; user: User } },
      UserLoginData
    >({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: IdentityAuthResponse) => ({
        status: true,
        statusDescription: 'Login successful.',
        data: {
          token: response.token,
          user: {
            id: response.userId,
            username: response.alias,
            alias: response.alias,
            displayName: response.alias,
          },
        },
      }),
      transformErrorResponse: (response) =>
        response?.data || {
          status: false,
          statusDescription: 'Login failed.',
          error: (response?.data as any)?.message || 'Unknown error',
        },
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    registerUser: builder.mutation<
      { status: boolean; statusDescription: string; data: { token: string; user: User } },
      UserRegistrationData
    >({
      query: (userInfo) => ({
        url: 'auth/register',
        method: 'POST',
        body: userInfo,
      }),
      transformResponse: (response: IdentityAuthResponse) => ({
        status: true,
        statusDescription: 'Registration successful.',
        data: {
          token: response.token,
          user: {
            id: response.userId,
            username: response.alias,
            alias: response.alias,
            displayName: response.alias,
          },
        },
      }),
      transformErrorResponse: (response) =>
        response?.data || {
          status: false,
          statusDescription: 'Registration failed.',
          error: (response?.data as any)?.message || 'Unknown error',
        },
    }),
    getCurrentUser: builder.query<
      { status: boolean; statusDescription: string; data: User },
      void
    >({
      query: () => 'profiles/me',
      transformResponse: (response: IdentityProfile) => ({
        status: true,
        statusDescription: 'User data fetched successfully.',
        data: toUser(response),
      }),
      transformErrorResponse: (response) =>
        response?.data || {
          status: false,
          statusDescription: 'Failed to fetch user data.',
          error: (response?.data as any)?.message || 'Unknown error',
        },
      providesTags: [{ type: 'User', id: 'ME' }],
    }),
    updateUser: builder.mutation<
      { status: boolean; statusDescription: string; data: User },
      Partial<User> & { id?: string }
    >({
      query: (patch) => ({
        url: 'profiles/me',
        method: 'PUT',
        body: {
          firstName: patch.firstName,
          lastName: patch.lastName,
          birthDate: patch.birthDate,
        },
      }),
      transformResponse: (response: IdentityProfile) => ({
        status: true,
        statusDescription: 'User updated successfully.',
        data: toUser(response),
      }),
      transformErrorResponse: (response) =>
        response?.data || {
          status: false,
          statusDescription: 'Failed to update user.',
          error: (response?.data as any)?.message || 'Unknown error',
        },
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    getUserById: builder.query<
      { status: boolean; statusDescription: string; data: User },
      string
    >({
      query: (aliasOrId) => `profiles/${aliasOrId}`,
      transformResponse: (response: IdentityProfile) => ({
        status: true,
        statusDescription: 'User data fetched successfully.',
        data: toUser(response),
      }),
      transformErrorResponse: (response) =>
        response?.data || {
          status: false,
          statusDescription: 'Failed to fetch user data.',
          error: (response?.data as any)?.message || 'Unknown error',
        },
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
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
} = userApiSlice;
