// src/features/posts/components/CreatePostForm.tsx
import React, { useState } from 'react';
import { UseAuth } from '../../../context/AuthContext';
import { Box, Button, TextField, MenuItem, Paper, Typography } from '@mui/material';
import type { Post } from '../../../utils'; // Asegúrate que Post incluye 'type'

interface CreatePostFormProps {
  onAddPost: (postData: Omit<Post, 'id' | 'author' | 'likes' | 'comments' | 'createdAt' | 'userId'> & { type: Post['type'] }) => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onAddPost }) => {
  const { currentUser } = UseAuth();
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
    return <Typography align="center" color="text.secondary">Debes iniciar sesión para crear una publicación.</Typography>;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
      <Paper elevation={8} sx={{
        p: 4,
        mb: 6,
        maxWidth: 540,
        width: '100%',
        borderRadius: 4,
        background: '#fff',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
      }}>
        <Typography variant="h4" fontWeight={900} align="center" gutterBottom sx={{ color: '#36465d', letterSpacing: 1 }}>
          Crear publicación
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            select
            label="Tipo de Post"
            value={postType}
            onChange={(e) => setPostType(e.target.value as Post['type'])}
            fullWidth
            margin="normal"
            sx={{ fontWeight: 700, fontSize: 18 }}
          >
            <MenuItem value="text">Texto</MenuItem>
            <MenuItem value="image">Imagen (URL)</MenuItem>
            <MenuItem value="quote">Cita</MenuItem>
          </TextField>

          {postType === 'image' ? (
            <TextField
              label="URL de la Imagen"
              type="url"
              placeholder="https://example.com/image.png"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              fullWidth
              margin="normal"
              sx={{ fontSize: 18 }}
            />
          ) : (
            <TextField
              label={postType === 'quote' ? 'Cita' : 'Contenido'}
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={postType === 'quote' ? 'La cita inspiradora...' : 'Escribe algo...'}
              required
              fullWidth
              margin="normal"
              sx={{ fontSize: 18 }}
            />
          )}

          <TextField
            label={postType === 'quote' ? 'Autor de la cita (Título)' : 'Título (Opcional)'}
            type="text"
            placeholder="Un título interesante"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ fontSize: 18 }}
          />

          <TextField
            label="Etiquetas (separadas por comas)"
            type="text"
            placeholder="viajes, comida, codigo"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ fontSize: 18 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, fontWeight: 900, fontSize: 18, background: '#36465d', '&:hover': { background: '#222f3e' } }}>
            Publicar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreatePostForm;