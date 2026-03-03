import { useCallback, useMemo } from 'react';
import { type NavigateOptions, type Params, useLocation, useNavigate } from 'react-router-dom';
import { buildFullPath, buildResolvedTo, normalizeRouterOptions } from '../utils';

export interface Router {
  push: (to: string | RouterOptions) => void | Promise<void>;
  replace: (to: string | RouterOptions) => void | Promise<void>;
  go: (delta: number) => void | Promise<void>;
  back: () => void | Promise<void>;
  forward: () => void | Promise<void>;
  resolve: (to: string | RouterOptions) => {
    href: string;
    path: string;
    fullPath: string;
    query: Record<string, any>;
    hash: string;
  };
  current: string;
}

export interface RouterOptions extends NavigateOptions {
  path?: string;
  name?: string;
  params?: Params;
  replace?: boolean;
  state?: any;
  hash?: string;
  query?: Record<string, any>;
}

/**
 * React adapter for Vue Router's useRouter.
 * @see https://router.vureact.top/guide/use-router-and-use-route.html
 */
export function useRouter(): Router {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavigateOptions = useCallback(
    (to: string | RouterOptions): NavigateOptions | undefined => {
      if (typeof to === 'string') return undefined;
      const { replace, ...opts } = to;
      return opts;
    },
    [],
  );

  const router = useMemo<Router>(
    () => ({
      push: (to) => {
        const normalized =
          typeof to === 'string' ? to : normalizeRouterOptions(to, location.pathname);
        return navigate(buildFullPath(normalized, location.pathname), getNavigateOptions(to));
      },

      replace: (to) => {
        const normalized =
          typeof to === 'string' ? to : normalizeRouterOptions(to, location.pathname);
        const opts = getNavigateOptions(to) ?? {};
        return navigate(buildFullPath(normalized, location.pathname), {
          ...opts,
          replace: true,
        });
      },

      go: (delta) => {
        return navigate(delta);
      },

      back: () => {
        return navigate(-1);
      },

      forward: () => {
        return navigate(1);
      },

      resolve: (to) => {
        const resolved = buildResolvedTo(to, location.pathname);
        const fullPath = `${resolved.pathname}${resolved.search}${resolved.hash}`;
        const query = resolved.search
          ? Object.fromEntries(new URLSearchParams(resolved.search.slice(1)).entries())
          : {};
        return {
          href: fullPath,
          path: resolved.pathname,
          fullPath,
          query,
          hash: resolved.hash,
        };
      },

      current: location.pathname + location.search + location.hash,
    }),
    [location.pathname, location.search, location.hash, navigate, getNavigateOptions],
  );

  return router;
}
