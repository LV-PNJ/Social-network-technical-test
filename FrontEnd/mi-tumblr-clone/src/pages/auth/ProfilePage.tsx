import { useGetPostsByUserIdQuery } from '@/features/posts/postApiSlice';
import { useParams } from 'react-router-dom';
import { UseAuth } from '../../context/AuthContext';
import PostList from '../../features/posts/components/PostList';

const ProfilePage: React.FC = () => {
  const { currentUser } = UseAuth();

  const { data: userPosts, isLoading: isPostsLoading, error: postsError } = useGetPostsByUserIdQuery(currentUser?.id!);

  const handleLikePost = (postId: string) => {
    if (!currentUser) return;
    // Implement like functionality using mutation
  };

  if (isPostsLoading) {
    return <p className="text-center text-gray-500 mt-10">Cargando...</p>;
  }

  if (postsError) {
    return <p className="text-center text-gray-500 mt-10">Error al cargar datos.</p>;
  }

  if (!currentUser) {
    return <p className="text-center text-gray-500 mt-10">Usuario no encontrado.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col items-center sm:flex-row sm:items-start">
        <img
          src={currentUser.avatarUrl || 'https://i.pravatar.cc/150?u=default'}
          alt={currentUser.username}
          className="w-32 h-32 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 border-4 border-blue-500"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-1">{currentUser.username}</h1>
          <p className="text-gray-600 mb-1">{currentUser.email}</p>
          {currentUser.bio && <p className="text-gray-700 mt-2">{currentUser.bio}</p>}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Publicaciones de {currentUser.username}</h2>
      <PostList posts={userPosts || []} onLike={handleLikePost} onAddComment={() => {}} />
    </div>
  );
};

export default ProfilePage; 