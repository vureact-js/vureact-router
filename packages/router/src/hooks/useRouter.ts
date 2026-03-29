import { useSyncExternalStore } from 'react';
import type { Router } from '../creator/createRouter';
import { useRouterContext } from '../context/RouterContext';
export type { RouteLocationOptions, RouteLocationRaw } from '../types/route-location';

/**
 * React adapter for Vue Router's useRouter.
 * @see https://router.vureact.top/guide/use-router-and-use-route.html
 */
export function useRouter(): Router {
  const { router } = useRouterContext();

  useSyncExternalStore(
    (onStoreChange) => router.router.subscribe(() => onStoreChange()),
    () => {
      const location = router.router.state.location;
      return `${location.pathname}${location.search}${location.hash}`;
    },
    () => '',
  );

  return router;
}
