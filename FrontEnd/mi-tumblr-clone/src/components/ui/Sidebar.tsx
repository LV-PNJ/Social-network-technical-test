import { Link, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
} from '@mui/material'
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'

const drawerWidth = 240

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
]

export default function Sidebar() {
  const location = useLocation()
  const theme = useTheme()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100% - 64px)',
          backgroundColor: theme.palette.background.default,
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  color: theme.palette.text.secondary,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                    color: theme.palette.primary.main,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: '600' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
} 