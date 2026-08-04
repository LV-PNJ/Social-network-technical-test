import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Post, CreatePostData, UpdatePostData } from '../../types/post';
import { getStoredToken } from '@/utils/storage'; 

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const postApiSlice = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL, 
    prepareHeaders: (headers, { getState }) => {
      const token = getStoredToken(); 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Post', 'UserPosts'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], { page?: number; size?: number } | void>({
      query: (params) => {
        const page = params?.page ?? 1;
        const size = params?.size ?? 20;
        return `posts?page=${page}&size=${size}`;
      },
      transformResponse: (response: any) => {
        if (response.data && response.data.posts) {
          return response.data.posts;
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Post', id: 'LIST' }]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    getPostsByUserId: builder.query<Post[], string>({
      query: (userId) => `posts/by-user/${userId}`,
      transformResponse: (response: any) => response.data?.posts || [],
      providesTags: (result, error, userId) => 
        result
          ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'UserPosts', id: userId }]
          : [{ type: 'UserPosts', id: userId }],
    }),
    getPostById: builder.query<Post, string>({
      query: (postId) => `posts/${postId}`,
      transformResponse: (response: any) => {
        if (response.data && response.data.post) {
          return response.data.post;
        }
        // Handle case where post might not be found or structure is wrong
        throw new Error(response.data?.message || 'Failed to fetch post details');
      },
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation<Post, CreatePostData>({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      transformResponse: (response: any) => {
        if (response.data && response.data.post) {
          return response.data.post;
        }
        throw new Error(response.data?.message || 'Failed to create post');
      },
      invalidatesTags: (result, error, arg) => {
        const tags: any[] = [{ type: 'Post', id: 'LIST' }];
        // if (result?.user?.id) { // Assuming result is the new Post object
        //   tags.push({ type: 'UserPosts', id: result.user.id });
        // }
        return tags;
      },
    }),
    updatePost: builder.mutation<Post, { postId: string; data: UpdatePostData }>({
      query: ({ postId, data }) => ({
        url: `posts/${postId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => {
        if (response.data && response.data.post) {
          return response.data.post;
        }
        throw new Error(response.data?.message || 'Failed to update post');
      },
      invalidatesTags: ({ postId }) => [{ type: 'Post', id: postId }],
    }),
    deletePost: builder.mutation<{ success: boolean; id: string }, string>({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any) => {
        // Backend returns { statusCode, ..., data: { message, postId } }
        if (response.data) {
            return { success: true };
        }
        throw new Error(response.data?.message || 'Failed to delete post');
      },
      invalidatesTags: (id) => [{ type: 'Post', id }, { type: 'Post', id: 'LIST' } /*, { type: 'UserPosts', id: 'ME' } */ ],
    }),
    likePost: builder.mutation<Post, string>({
      query: (postId) => ({
        url: `posts/${postId}/like`,
        method: 'POST',
      }),
      transformResponse: (response: any) => {
        if (response.data && response.data.post) {
          return response.data.post;
        }
        throw new Error(response.data?.message || 'Failed to like post');
      },
      // Optimistic update logic would go into onQueryStarted
      // For now, just invalidating the specific post tag
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    unlikePost: builder.mutation<Post, string>({
      query: (postId) => ({
        url: `posts/${postId}/like`, // Corrected to /like for DELETE method on same resource
        method: 'DELETE',
      }),
      transformResponse: (response: any) => {
        if (response.data && response.data.post) {
          return response.data.post;
        }
        throw new Error(response.data?.message || 'Failed to unlike post');
      },
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery, // Keep exported for now, but consider removing if endpoint is invalid
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} = postApiSlice; 