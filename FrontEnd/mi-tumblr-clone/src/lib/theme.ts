import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00B8FF',
      light: '#33C6FF',
      dark: '#0082B3',
      contrastText: '#000000',
    },
    secondary: {
      main: '#E5E7EA',
      light: '#F3F8FB',
      dark: '#A0A1A3',
      contrastText: '#000000',
    },
    background: {
      default: '#001935',
      paper: 'rgba(255, 255, 255, 0.07)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: [
      'Favorit',
      'Helvetica Neue',
      'HelveticaNeue',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '3px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
}); 