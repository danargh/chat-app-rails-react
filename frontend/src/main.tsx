import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import { Router } from './pages/index.tsx';
import { SnackbarProvider } from 'notistack';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <SnackbarProvider>
         <Router />
      </SnackbarProvider>
   </StrictMode>
);
