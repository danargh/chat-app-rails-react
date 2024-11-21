import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import { Router } from './pages/index.tsx';
import { SnackbarProvider } from 'notistack';
import { StoreProvider } from './core/store.ts';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <SnackbarProvider>
         <StoreProvider>
            <Router />
         </StoreProvider>
      </SnackbarProvider>
   </StrictMode>
);
