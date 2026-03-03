import { useEffect } from 'react';
import { useRouterContext } from '../context/RouterContext';
import { type ComponentGuards } from '../guards/guardManager';

/**
 * React adapter for Vue Router's beforeRouteLeave.
 * @see https://router.vureact.top/guide/component-guards.html
 */
export function useBeforeRouteLeave(fn: ComponentGuards['guard']) {
  const { guardManager } = useRouterContext();

  useEffect(() => {
    return guardManager.registerComponentGuard('beforeRouteLeaveGuards', fn);
  }, [fn, guardManager]);
}
