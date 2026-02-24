import { useEffect } from 'react';
import { useRouterContext } from '../context/RouterContext';
import { type ComponentGuards } from '../guards/guardManager';

/**
 * React adapter for Vue Router's beforeRouteUpdate.
 * @see https://router-vureact.vercel.app/guide/component-guards.html
 */
export function useBeforeRouteUpdate(fn: ComponentGuards['guard']) {
  const { guardManager } = useRouterContext();

  useEffect(
    () => guardManager.registerComponentGuard('beforeRouteUpdateGuards', fn),
    [fn, guardManager],
  );
}
