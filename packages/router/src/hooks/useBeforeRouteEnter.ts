import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ComponentGuards } from '../guards/guardManager';
import { buildFullPath } from '../utils';
import { useGuardManager } from './useGuardManager';
import { useRoute } from './useRoute';

/**
 * Experimental approximation of Vue Router's beforeRouteEnter.
 *
 * In React Hooks this guard runs after component mount and does not expose
 * Vue-style component instance callback semantics.
 *
 * @see https://router.vureact.top/guide/component-guards.html
 */
export function useBeforeRouteEnter(fn: ComponentGuards['guard']) {
  const guardManager = useGuardManager();
  const route = useRoute();
  const navigate = useNavigate();

  useEffect(() => {
    const transition = guardManager.getLatestTransition();
    const from = transition?.from ?? route;

    Promise.resolve(fn(route, from)).then((result) => {
      if (result === false) {
        navigate(from.fullPath, { replace: true, state: from.state });
        return;
      }

      if (typeof result === 'string') {
        navigate(result, { replace: true });
        return;
      }

      if (result && typeof result === 'object') {
        navigate(buildFullPath(result), { replace: true, state: (result as any).state });
      }
    });

    return guardManager.registerComponentGuard('beforeRouteEnterGuards', fn);
    // run only when a component enters/mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
