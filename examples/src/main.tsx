import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { routerInstance } from './router';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <routerInstance.RouterProvider />
  </StrictMode>,
);
