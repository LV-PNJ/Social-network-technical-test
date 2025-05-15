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
  const { user } = UseAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [localPost, setLocalPost] = useState(post)

  const [likePostMutation, { isLoading: isLiking }] = useLikePostMutation();
  const [unlikePostMutation, { isLoading: isUnliking }] = useUnlikePostMutation();

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const isLiked = user && localPost.likedBy ? localPost.likedBy.includes(user.id) : false
  const isAuthor = user && localPost.user ? localPost.user.id === user.id : false

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
    if (!user || isLiking || isUnliking) return

    const originalPost = { ...localPost };
    const newLikedBy = [...(localPost.likedBy || [])];
    let newLikesCount = localPost.likesCount || 0;

    if (isLiked) {
      const userIndex = newLikedBy.indexOf(user.id);
      if (userIndex > -1) newLikedBy.splice(userIndex, 1);
      newLikesCount = Math.max(0, newLikesCount - 1);
    } else {
      if (!newLikedBy.includes(user.id)) newLikedBy.push(user.id);
      newLikesCount += 1;
    }
    setLocalPost({ ...localPost, likedBy: newLikedBy, likesCount: newLikesCount });

    try {
      const updatedPostFromServer = isLiked
        ? await unlikePostMutation(localPost.id).unwrap()
        : await likePostMutation(localPost.id).unwrap();
      setLocalPost(updatedPostFromServer);
    } catch (error) {
      console.error('Failed to update like:', error);
      setLocalPost(originalPost);
    }
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            component={Link}
            to={`/profile/${localPost.user?.username || ''}`}
            src={localPost.user?.avatar}
            alt={localPost.user?.username}
          />
        }
        action={
          isAuthor && (
            <>
              <IconButton aria-label="settings" onClick={handleMenuClick} disabled={isLiking || isUnliking}>
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
            to={`/profile/${localPost.user?.username || ''}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {localPost.user?.username}
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
        <IconButton onClick={handleLikeClick} color={isLiked ? 'primary' : 'default'} disabled={isLiking || isUnliking}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {localPost.likesCount}
        </Typography>
      </CardActions>
    </Card>
  )
} 