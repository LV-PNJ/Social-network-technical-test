
// src/features/posts/components/PostList.tsx
import React from 'react';
import type { Post } from '../../../utils';
import PostItem from './PostItem';

interface PostListProps {
  posts: Post[];
  onLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onLike, onAddComment }) => {
  if (!posts.length) {
    return <p className="text-center text-gray-500">No hay publicaciones todavía.</p>;
  }

  return (
    <div>
      {posts.map(post => (
        <PostItem key={post.id} post={post} onLike={onLike} onAddComment={onAddComment} />
      ))}
    </div>
  );
};

export default PostList;