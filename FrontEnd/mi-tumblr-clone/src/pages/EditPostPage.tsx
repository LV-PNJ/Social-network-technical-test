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
import { getPost, updatePost } from '@/features/posts/services/postService'
import { useAuth } from '@/context/AuthContext'

export default function EditPostPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return

      try {
        const post = await getPost(postId)
        if (post.author.id !== user?.id) {
          navigate('/')
          return
        }
        setContent(post.content)
        if (post.imageUrl) {
          setCurrentImageUrl(post.imageUrl)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId, user, navigate])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setCurrentImageUrl(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!postId || !content.trim()) return

    setSaving(true)
    setError('')

    try {
      let imageUrl = currentImageUrl
      if (image) {
        // In a real app, you would upload the image to a storage service
        // and get back the URL. This is just a placeholder.
        imageUrl = URL.createObjectURL(image)
      }

      await updatePost(postId, {
        content: content.trim(),
        imageUrl,
      })

      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
          />

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
            >
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {(image || currentImageUrl) && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setImage(null)
                  setImagePreview(null)
                  setCurrentImageUrl(null)
                }}
              >
                Remove Photo
              </Button>
            )}
          </Stack>

          {(imagePreview || currentImageUrl) && (
            <Box
              component="img"
              src={imagePreview || currentImageUrl}
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
              disabled={!content.trim() || saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
} 