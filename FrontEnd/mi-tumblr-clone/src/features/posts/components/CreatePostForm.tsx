// src/features/posts/components/CreatePostForm.tsx
import React, { useState, useEffect } from 'react';
import { UseAuth } from '@/hooks/UseAuth'; 
import { Box, Button, TextField, MenuItem, Typography, CircularProgress, Stack, useTheme, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { CreatePostData, PostType } from '@/types/post';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

// Props coming from MainLayout
interface CreatePostFormProps {
  onAddPost: (postData: CreatePostData) => Promise<void>;
  onCloseModal: () => void;
  isSubmitting: boolean;
}

const postTypeOptions: { value: PostType; label: string; icon: React.ReactElement }[] = [
  { value: 'text', label: 'Texto', icon: <TextFieldsIcon /> },
  { value: 'image', label: 'Imagen', icon: <ImageIcon /> },
  { value: 'quote', label: 'Cita', icon: <FormatQuoteIcon /> },
  // Add more types here as they are implemented
];

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onAddPost, onCloseModal, isSubmitting }) => {
  const { currentUser } = UseAuth();
  const theme = useTheme();
  const [postType, setPostType] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // For image posts
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form when postType changes, to clear irrelevant fields
  useEffect(() => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setTags('');
    setFormError(null);
  }, [postType]);

  const handlePostTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newPostType: PostType | null,
  ) => {
    if (newPostType !== null) {
      setPostType(newPostType);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (postType === 'image' && !imageUrl.trim()) {
      setFormError('La URL de la imagen es obligatoria para posts de tipo imagen.');
      return;
    }
    if (postType !== 'image' && !content.trim()) {
      setFormError('El contenido es obligatorio.');
      return;
    }
    if (!currentUser) {
      setFormError('Debes iniciar sesión para crear una publicación.');
      return;
    }

    const postData: CreatePostData = {
      type: postType,
      title: title.trim() || undefined,
      content: postType === 'image' ? imageUrl.trim() : content.trim(), // Use imageUrl for image posts
      imageUrl: postType === 'image' ? imageUrl.trim() : undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      // Other fields like videoUrl, linkUrl, quoteSource would be handled similarly if added
    };

    await onAddPost(postData);
    // onCloseModal will be called by MainLayout if submission is successful
  };

  if (!currentUser) {
    return <Typography align="center" color="error">Debes iniciar sesión.</Typography>;
  }

  return (
    // The Paper styling is now handled by the Dialog in MainLayout
    // Box container for the form elements, DialogContent provides padding
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}> 
      <Typography variant="overline" display="block" gutterBottom sx={{ color: theme.palette.text.secondary, textAlign: 'center', mb: 1 }}>
        Tipo de publicación
      </Typography>
      <ToggleButtonGroup
        value={postType}
        exclusive
        onChange={handlePostTypeChange}
        aria-label="Tipo de post"
        fullWidth
        disabled={isSubmitting}
        sx={{
          mb: 2,
          display: 'grid',
          gridTemplateColumns: `repeat(${postTypeOptions.length}, 1fr)`,
          gap: 1,
          '& .MuiToggleButton-root': {
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : theme.palette.grey[200],
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px !important',
            transition: 'background-color 0.3s, color 0.3s',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : theme.palette.grey[300],
            },
            '&.Mui-selected': {
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          },
        }}
      >
        {postTypeOptions.map((option) => (
          <ToggleButton 
            value={option.value} 
            key={option.value} 
            aria-label={option.label}
            sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p:1, height: 'auto'}}
          >
            {option.icon}
            <Typography variant="caption" sx={{ lineHeight: 1.2, mt: 0.5, fontWeight: 'medium' }}>{option.label}</Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {postType === 'image' && (
        <TextField
          label="URL de la Imagen"
          type="url"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="filled"
          disabled={isSubmitting}
          sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.09)' : theme.palette.grey[200],
            borderRadius: 1,
           }}
        />
      )}

      {(postType === 'text' || postType === 'quote') && (
        <TextField
          label={postType === 'quote' ? 'Cita' : 'Contenido'}
          multiline
          rows={postType === 'text' ? 4 : 2} // Shorter for quotes
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={postType === 'quote' ? 'La vida es bella...' : '¿Qué estás pensando?'}
          required
          fullWidth
          margin="normal"
          variant="filled"
          disabled={isSubmitting}
          sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.09)' : theme.palette.grey[200],
            borderRadius: 1,
           }}
        />
      )}

      <TextField
        label={postType === 'quote' ? 'Fuente (Opcional)' : 'Título (Opcional)'}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
        variant="filled"
        disabled={isSubmitting}
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.09)' : theme.palette.grey[200],
          borderRadius: 1,
         }}
      />

      <TextField
        label="Etiquetas (separadas por comas)"
        type="text"
        placeholder="noticias, divertido, arte"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
        margin="normal"
        variant="filled"
        disabled={isSubmitting}
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.09)' : theme.palette.grey[200],
          borderRadius: 1,
         }}
      />

      {formError && (
        <Typography color="error" variant="body2" sx={{ mt: 1, mb: 1 }}>
          {formError}
        </Typography>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button 
          onClick={onCloseModal} 
          variant="outlined" 
          disabled={isSubmitting} 
          sx={{color: theme.palette.text.secondary}}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={isSubmitting} 
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ flexGrow: 1 }}
        >
          {isSubmitting ? 'Publicando...' : 'Publicar'}
        </Button>
      </Stack>
    </Box>
  );
};

export default CreatePostForm;