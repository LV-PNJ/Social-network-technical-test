import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
} from '@mui/material'
import {
  Add as AddIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { UseAuth } from '@/hooks/UseAuth'; 

// Import NavbarProps from MainLayout or define it here if preferred
// For simplicity, let's assume MainLayout exports it or it's in a shared types file
// If not, define it here:
interface NavbarProps {
  onOpenCreatePostModal: () => void;
}

export default function Navbar({ onOpenCreatePostModal }: NavbarProps) {
  const { currentUser, logout } = UseAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    navigate('/login')
  }

  const handleProfile = () => {
    handleClose()
    if (currentUser?.id) {
      navigate(`/profile/${currentUser.id}`)
    } else {
      navigate('/')
    }
  }

  return (
    <AppBar 
      position="fixed" 
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}
        >
          DevX
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            onClick={onOpenCreatePostModal}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ fontWeight: 'bold' }}
          >
            Create
          </Button>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {currentUser?.avatar ? (
              <Avatar src={currentUser.avatar} alt={currentUser.username} sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 32 }} />
            )}
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile} sx={{ color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit'}}>Profile</MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit'}}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
} 