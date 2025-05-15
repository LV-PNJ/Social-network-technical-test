import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  Stack,
  CircularProgress
} from '@mui/material'
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material'
import { useCreatePostMutation } from '@/features/posts/postApiSlice'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [createPost, { isLoading, error: mutationError }] = useCreatePostMutation();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImage(null);
      setImagePreview(null);
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!content.trim()) {
      alert('Content cannot be empty.');
      return;
    }

    try {
      let imageUrlToSubmit: string | undefined = undefined;
      if (image) {
        imageUrlToSubmit = imagePreview || undefined;
         console.warn("Using placeholder image URL logic. Implement proper image upload and URL handling.");
      }

      await createPost({
        content: content.trim(),
        imageUrl: imageUrlToSubmit,
      }).unwrap();

      navigate('/')
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  }
  
  const displayError = (mutationError as any)?.data?.message || (mutationError as any)?.error;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create Post
        </Typography>

        {displayError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof displayError === 'string' ? displayError : JSON.stringify(displayError)}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
            disabled={isLoading}
          />

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              disabled={isLoading}
            >
              Add Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </Button>
            {image && (
              <Typography variant="body2" color="text.secondary">
                {image.name}
              </Typography>
            )}
          </Stack>

          {imagePreview && (
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 2,
              }}
            />
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!content.trim() || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Post'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')} disabled={isLoading}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
} 