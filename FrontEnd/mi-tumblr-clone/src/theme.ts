import { createTheme } from '@mui/material/styles';

// A custom theme for this app, inspired by Tumblr's dark interface
const theme = createTheme({
  palette: {
    mode: 'dark', // Set mode to dark to influence default component styling
    primary: {
      main: '#529BFF', // A lighter blue for primary actions, good contrast on dark bg
    },
    secondary: {
      main: '#A9B5C2', // A muted, light grey/blue for secondary elements
    },
    error: {
      main: '#f44336', // Standard Material UI red for errors
    },
    background: {
      default: '#001935', // Tumblr's characteristic dark navy/charcoal background
      paper: '#002B4D',   // A slightly lighter shade for paper elements like cards
    },
    text: {
      primary: '#FFFFFF',       // White for primary text on dark background
      secondary: '#A9B5C2',    // Light grey for secondary text
      disabled: '#6A7C8D',    // Muted color for disabled text
    },
    divider: '#003C6B', // A darker blue for dividers
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    // You might want to customize h1, h2, etc. to match Tumblr's typography
    // Ensure text colors in typography settings also provide good contrast
    h1: { color: '#FFFFFF' },
    h2: { color: '#FFFFFF' },
    h3: { color: '#FFFFFF' },
    h4: { color: '#FFFFFF' },
    h5: { color: '#FFFFFF' },
    h6: { color: '#FFFFFF' },
    body1: { color: '#E0E0E0' }, // Slightly off-white for body text for comfort
    body2: { color: '#A9B5C2' },
  },
  components: {
    // Example: Customizing AppBar for the dark theme
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#002B4D', // AppBar background
          color: '#FFFFFF', // AppBar text color
        },
      },
    },
    // Example: Customizing Button for the dark theme
    MuiButton: {
      styleOverrides: {
        root: {
          // You can add general button styles here
        },
        containedPrimary: {
          color: '#FFFFFF', // Ensure text on primary buttons is white for contrast
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                backgroundColor: '#002B4D',
            }
        }
    }
    // Add more component overrides as needed
  },
});

export default theme; 