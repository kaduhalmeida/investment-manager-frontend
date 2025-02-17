// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Adicione o ThemeProvider
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;