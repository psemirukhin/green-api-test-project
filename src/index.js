import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import { AppProvider } from './context/AppContext';

const theme = createTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AppProvider>
        <CssBaseline />
        <App />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>
);
