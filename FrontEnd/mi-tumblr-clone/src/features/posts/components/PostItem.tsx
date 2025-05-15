// src/features/posts/components/PostItem.tsx
import React, { useState } from 'react';
import type { Post, Comment as CommentType } from '../../../utils';
import { UseAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Link } from 'react-router-dom';

interface PostItemProps {
  post: Post;
  onLike: (postId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onLike }) => {
  const { currentUser } = UseAuth();
  const hasLiked = currentUser && Array.isArray(post.likes) && post.likes.includes(currentUser.id);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <img
          src={'https://i.pravatar.cc/150?u=default'}
          alt={post.userId}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <Link to={`/profile/${post.userId}`} className="font-semibold text-blue-600 hover:underline">
            {post.userId}
          </Link>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {post.title && <h2 className="text-xl font-semibold mb-2">{post.title}</h2>}

      {post.type === 'text' && <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>}
      {post.type === 'image' && <img src={post.content} alt={post.title || 'Post image'} className="rounded-md mb-4 max-h-96 w-auto mx-auto" />}
      {post.type === 'quote' && (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
          <p>"{post.content}"</p>
          {post.title && <footer className="text-sm">- {post.title}</footer>}
        </blockquote>
      )}
      {/* Añadir más tipos de post según sea necesario */}

      {post.tags && post.tags.length > 0 && (
        <div className="mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => currentUser && onLike(post.id)}
            disabled={!currentUser}
            className={`text-sm ${hasLiked ? 'text-red-500' : 'text-gray-500'}`}
            variant="secondary"
          >
            ❤️ {Array.isArray(post.likes) ? post.likes.length : 0} {hasLiked ? 'Liked' : 'Like'}
          </Button>
        </div>
        {/* Aquí podrían ir opciones de rebloguear, compartir, etc. */}
      </div>
    </div>
  );
};

export default PostItem;

