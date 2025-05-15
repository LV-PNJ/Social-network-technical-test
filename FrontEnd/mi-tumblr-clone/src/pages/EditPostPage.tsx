import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material'
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material'
import { useGetPostByIdQuery, useUpdatePostMutation } from '@/features/posts/postApiSlice'
import { UseAuth } from '@/context/AuthContext'

export default function EditPostPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = UseAuth()
  
  const [content, setContent] = useState('')
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null | undefined>(undefined)
  
  const { data: postData, isLoading: isLoadingPost, error: fetchError, refetch } = useGetPostByIdQuery(postId!, {
    skip: !postId,
  });

  const [updatePost, { isLoading: isUpdating, error: updateMutationError }] = useUpdatePostMutation();

  useEffect(() => {
    if (postData) {
      if (postData.user?.id !== currentUser?.id) {
        alert("You are not authorized to edit this post.");
        navigate('/');
        return;
      }
      setContent(postData.content);
      setExistingImageUrl(postData.imageUrl);
      setImagePreview(null);
      setNewImageFile(null);
    }
  }, [postData, currentUser, navigate]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setExistingImageUrl(null);
    } else {
      setNewImageFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setNewImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!postId || !content.trim()) return;

    let imageUrlToUpdate: string | null | undefined = existingImageUrl;
    if (newImageFile) {
      console.warn("Image upload not implemented. Using placeholder logic for new image.");
      imageUrlToUpdate = imagePreview;
    } else if (existingImageUrl === null && imagePreview === null) {
      imageUrlToUpdate = null;
    }

    try {
      await updatePost({
        postId,
        data: {
          content: content.trim(),
          imageUrl: imageUrlToUpdate,
        },
      }).unwrap();
      navigate(`/`);
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  if (isLoadingPost) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    const errorMessage = (fetchError as any)?.data?.message || (fetchError as any)?.error || 'Failed to load post for editing.';
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
            <Typography color="error">Error: {errorMessage}</Typography>
            <Button onClick={() => refetch()}>Try Again</Button>
        </Box>
    );
  }
  
  if (!postData) {
    return <Typography>Post not found or you do not have permission.</Typography>;
  }
  
  const displayUpdateError = (updateMutationError as any)?.data?.message || (updateMutationError as any)?.error;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Post
        </Typography>

        {displayUpdateError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof displayUpdateError === 'string' ? displayUpdateError : JSON.stringify(displayUpdateError)}
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
            disabled={isUpdating}
          />

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              disabled={isUpdating}
            >
              Change Photo
              <input type="file" accept="image/*" hidden onChange={handleImageChange} disabled={isUpdating} />
            </Button>
            {(newImageFile || existingImageUrl) && (
              <Button variant="outlined" color="error" onClick={handleRemoveImage} disabled={isUpdating}>
                Remove Photo
              </Button>
            )}
          </Stack>

          {(imagePreview || existingImageUrl) && (
            <Box
              component="img"
              src={imagePreview || existingImageUrl}
              alt="Preview"
              sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 1, mb: 2 }}
            />
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" disabled={!content.trim() || isUpdating}>
              {isUpdating ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')} disabled={isUpdating}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 