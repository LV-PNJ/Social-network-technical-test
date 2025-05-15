
// src/features/posts/components/CreatePostForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import type { Post } from '../../../utils'; // Asegúrate que Post incluye 'type'

interface CreatePostFormProps {
  onAddPost: (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'createdAt' | 'userId'> & { type: Post['type'] }) => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onAddPost }) => {
  const { currentUser } = useAuth();
  const [postType, setPostType] = useState<Post['type']>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;

    onAddPost({
      type: postType,
      title: title.trim() || undefined,
      content: content.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    });

    setTitle('');
    setContent('');
    setTags('');
    setPostType('text'); // Reset
  };

  if (!currentUser) {
    return <p className="text-center text-gray-500">Debes iniciar sesión para crear una publicación.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Crear Nueva Publicación</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Post</label>
        <select
          value={postType}
          onChange={(e) => setPostType(e.target.value as Post['type'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="text">Texto</option>
          <option value="image">Imagen (URL)</option>
          <option value="quote">Cita</option>
          {/* Añadir más tipos */}
        </select>
      </div>

      {postType === 'image' && (
        <Input
          label="URL de la Imagen"
          type="url"
          placeholder="https://example.com/image.png"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      )}

      {postType !== 'image' && (
         <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            {postType === 'quote' ? 'Cita' : 'Contenido'}
          </label>
          <textarea
            id="content"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={postType === 'quote' ? 'La cita inspiradora...' : 'Escribe algo...'}
            required
          />
        </div>
      )}
      
      <Input
        label={`Título (${postType === 'quote' ? 'Autor de la cita' : 'Opcional'})`}
        type="text"
        placeholder="Un título interesante"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        label="Etiquetas (separadas por comas)"
        type="text"
        placeholder="viajes, comida, codigo"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <Button type="submit" className="w-full" variant="primary">Publicar</Button>
    </form>
  );
};

export default CreatePostForm;