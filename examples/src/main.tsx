import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { routerInstance } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <routerInstance.RouterProvider />
  </StrictMode>,
);
