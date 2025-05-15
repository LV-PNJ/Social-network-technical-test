import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  TextField,
  Button,
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MoreVert as MoreVertIcon,
  Comment as CommentIcon,
} from '@mui/icons-material'
import { Post } from '@/types/post'
import { useAuth } from '@/context/AuthContext'
import { likePost, unlikePost, createComment } from '@/features/posts/services/postService'

interface PostCardProps {
  post: Post
  onEdit?: (post: Post) => void
  onDelete?: (post: Post) => void
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const { user } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localPost, setLocalPost] = useState(post)

  const isLiked = user ? localPost.likes.includes(user.id) : false
  const isAuthor = user ? localPost.author.id === user.id : false

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleMenuClose()
    if (onEdit) {
      onEdit(localPost)
    }
  }

  const handleDelete = () => {
    handleMenuClose()
    if (onDelete) {
      onDelete(localPost)
    }
  }

  const handleLikeClick = async () => {
    if (!user) return

    try {
      const updatedPost = isLiked
        ? await unlikePost(localPost.id)
        : await likePost(localPost.id)
      setLocalPost(updatedPost)
    } catch (error) {
      console.error('Failed to update like:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !comment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const updatedPost = await createComment({
        postId: localPost.id,
        content: comment,
      })
      setLocalPost(updatedPost)
      setComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            component={Link}
            to={`/profile/${localPost.author.username}`}
            src={localPost.author.avatar}
            alt={localPost.author.username}
          />
        }
        action={
          isAuthor && (
            <>
              <IconButton aria-label="settings" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )
        }
        title={
          <Link
            to={`/profile/${localPost.author.username}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {localPost.author.username}
          </Link>
        }
        subheader={new Date(localPost.createdAt).toLocaleDateString()}
      />
      {localPost.imageUrl && (
        <Box
          component="img"
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: 500,
            objectFit: 'cover',
          }}
          src={localPost.imageUrl}
          alt="Post content"
        />
      )}
      <CardContent>
        <Typography variant="body1">{localPost.content}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLikeClick} color={isLiked ? 'primary' : 'default'}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {localPost.likes.length}
        </Typography>
        <IconButton onClick={() => setShowComments(!showComments)}>
          <CommentIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {localPost.comments.length}
        </Typography>
      </CardActions>

      {showComments && (
        <Box sx={{ p: 2, pt: 0 }}>
          {user && (
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                disabled={!comment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </Box>
          )}

          {localPost.comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Avatar
                  component={Link}
                  to={`/profile/${comment.author.username}`}
                  src={comment.author.avatar}
                  sx={{ width: 24, height: 24, mr: 1 }}
                />
                <Typography
                  component={Link}
                  to={`/profile/${comment.author.username}`}
                  variant="subtitle2"
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {comment.author.username}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ ml: 4 }}>
                {comment.content}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  )
} 