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
  useTheme,
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Post } from '@/types/post'
import { UseAuth } from '@/hooks/UseAuth'; 
import { useLikePostMutation, useUnlikePostMutation } from '@/features/posts/postApiSlice'

interface PostCardProps {
  post: Post
  onEdit?: (post: Post) => void
  onDelete?: (post: Post) => void
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const { currentUser } = UseAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const theme = useTheme()

  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()

  const likedByArray = Array.isArray(post.likedBy) ? post.likedBy : []
  const hasLiked = currentUser && likedByArray.includes(currentUser.id)
  const likesCount = likedByArray.length
  const isOwner = currentUser?.id === post.user?.id

  const handleLike = async () => {
    try {
      if (hasLiked) {
        await unlikePost(post.id).unwrap()
      } else {
        await likePost(post.id).unwrap()
      }
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  return (
    <Card sx={{ 
      mb: 3, 
      borderRadius: theme.shape.borderRadius * 2,
      boxShadow: theme.shadows[3],
    }}>
      <CardHeader
        avatar={
          <Avatar
            component={Link}
            to={`/profile/${post.user?.id || ''}`}
            src={post.user?.avatar || 'https://i.pravatar.cc/150?u=default'}
            alt={post.user?.username || 'User'}
            sx={{ width: 38, height: 38 }}
          />
        }
        action={
          isOwner && (
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: theme.palette.text.secondary }}>
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={
          <Link
            to={`/profile/${post.user?.id || ''}`}
            style={{ textDecoration: 'none', color: theme.palette.text.primary, fontWeight: 'bold' }}
          >
            {post.user?.username || 'Usuario'}
          </Link>
        }
        subheaderTypographyProps={{color: theme.palette.text.secondary}}
        subheader={new Date(post.createdAt).toLocaleString()}
        sx={{ pb: 0 }}
      />
      {post.imageUrl && (
        <Box
          component="img"
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: 600,
            objectFit: 'cover',
            mt: 1.5,
          }}
          src={post.imageUrl}
          alt="Post content"
        />
      )}
      <CardContent sx={{ pt: post.imageUrl ? 1.5 : 2, pb: '12px !important' }}>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary, whiteSpace: 'pre-line' }}>
          {post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ pt: 0, justifyContent: 'flex-end', pr: 1.5, pb: 1.5 }}>
        <IconButton 
          onClick={handleLike} 
          aria-label="like post" 
          sx={{ 
            color: hasLiked ? theme.palette.error.main : theme.palette.text.secondary,
            '&:hover': {
              color: hasLiked ? theme.palette.error.dark : theme.palette.common.white, 
            }
          }}
        >
          {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 'medium' }}>
          {likesCount}
        </Typography>
      </CardActions>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }
        }}
      >
        <MenuItem onClick={() => { onEdit?.(post); setAnchorEl(null); }} disabled={!isOwner}>Edit</MenuItem>
        <MenuItem onClick={() => { onDelete?.(post); setAnchorEl(null); }} disabled={!isOwner}>Delete</MenuItem>
      </Menu>
    </Card>
  )
} 