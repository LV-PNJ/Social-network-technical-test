import { useState, useEffect } from 'react'
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
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Post } from '@/types/post'
import { UseAuth } from '@/context/AuthContext'
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

  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()

  const hasLiked = currentUser && post.likedBy.includes(currentUser.id)
  const isOwner = currentUser?.id === post.user.id;

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
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            component={Link}
            to={`/profile/${post.user.id}`}
            src={post.user?.avatar || 'https://i.pravatar.cc/150?u=default'}
            alt={post.user.username}
          />
        }
        action={
          currentUser?.id === post.user.id && (
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={
          <Link
            to={`/profile/${post.user.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {post.user.username}
          </Link>
        }
        subheader={new Date(post.createdAt).toLocaleString()}
      />
      {post.imageUrl && (
        <Box
          component="img"
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: 500,
            objectFit: 'cover',
          }}
          src={post.imageUrl}
          alt="Post content"
        />
      )}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike} aria-label="like post">
          {hasLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography>{post.likedBy.length}</Typography>
        {onEdit && (
          <IconButton onClick={() => onEdit(post)} aria-label="edit post" disabled={!isOwner}>
            <EditIcon />
          </IconButton>
        )}
        {onDelete && (
          <IconButton onClick={() => onDelete(post)} aria-label="delete post" disabled={!isOwner}>
            <DeleteIcon />
          </IconButton>
        )}
      </CardActions>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { onEdit?.(post); setAnchorEl(null); }} disabled={!isOwner}>Edit</MenuItem>
        <MenuItem onClick={() => { onDelete?.(post); setAnchorEl(null); }} disabled={!isOwner}>Delete</MenuItem>
      </Menu>
    </Card>
  )
} 