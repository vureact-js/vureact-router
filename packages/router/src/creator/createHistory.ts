import {
  type MemoryRouterOpts,
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
} from 'react-router-dom';
import { type ReactRoute } from './createRouter/types';

export type RouterMode = 'hash' | 'history' | 'memoryHistory';

export function routerFactory(mode: RouterMode, routes: ReactRoute[], opts?: MemoryRouterOpts) {
  switch (mode) {
    case 'hash':
      return createHashRouter(routes);

    case 'history':
      return createBrowserRouter(routes);

    case 'memoryHistory':
      return createMemoryRouter(routes, opts);
  }
}

/**
 * React adapter for Vue Router's createWebHistory.
 * @see https://router.vureact.top/guide/history-modes.html
 */
export function createWebHistory(): RouterMode {
  return 'history';
}

/**
 * React adapter for Vue Router's createWebHashHistory.
 * @see https://router.vureact.top/guide/history-modes.html
 */
export function createWebHashHistory(): RouterMode {
  return 'hash';
}

/**
 * React adapter for Vue Router's createMemoryHistory.
 * @see https://router.vureact.top/guide/history-modes.html
 */
export function createMemoryHistory(): RouterMode {
  return 'memoryHistory';
}
