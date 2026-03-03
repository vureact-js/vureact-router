import { useCallback, useMemo } from 'react';
import { useMatch, useNavigate, useResolvedPath, type To } from 'react-router-dom';
import { buildSearchParams, resolvedPath } from '../utils';
import { type RouterOptions } from './useRouter';

export interface UseLinkOptions {
  to: string | RouterOptions;
  replace?: boolean;
}

export interface UseLinkRoute {
  href: string;
  path: string;
  fullPath: string;
  query: Record<string, any>;
  hash: string;
}

export interface UseLinkReturn {
  route: UseLinkRoute;
  href: string;
  isActive: boolean;
  isExactActive: boolean;
  navigate: () => void | Promise<void>;
  to: string | To;
  state?: any;
}

/**
 * React counterpart of Vue Router's `useLink`.
 *
 * It exposes the same core primitives used by `RouterLink`:
 * target href, active states, and imperative navigation callback.
 *
 * @see https://router.vureact.top/api/router-hooks.html
 */
export function useLink({ to, replace = false }: UseLinkOptions): UseLinkReturn {
  const navLink = useMemo(() => (typeof to === 'string' ? to : ''), [to]);

  const navOptions = useMemo<To & { state?: any }>(() => {
    if (typeof to !== 'object') {
      return {};
    }

    const normalized = { ...to };
    if (normalized.path && normalized.params) {
      normalized.params = undefined;
    }

    return {
      hash: normalized.hash,
      state: normalized.state,
      pathname: resolvedPath(normalized),
      search: buildSearchParams(normalized.query),
    };
  }, [to]);

  const state = navOptions.state;
  const toTarget = useMemo<string | To>(() => navLink || navOptions, [navLink, navOptions]);

  const resolved = useResolvedPath(toTarget);
  const isExactActive = Boolean(useMatch({ path: resolved.pathname, end: true }));
  const isActive = Boolean(useMatch({ path: resolved.pathname, end: false }));

  const href = useMemo(
    () => navLink || resolved.pathname + (resolved.search ?? '') + (resolved.hash ?? ''),
    [navLink, resolved],
  );

  const route = useMemo<UseLinkRoute>(() => {
    const query = resolved.search
      ? Object.fromEntries(new URLSearchParams(resolved.search.slice(1)).entries())
      : {};

    return {
      href,
      path: resolved.pathname,
      fullPath: href,
      query,
      hash: resolved.hash ?? '',
    };
  }, [href, resolved.pathname, resolved.search, resolved.hash]);

  const navigate = useNavigate();

  const navigateTo = useCallback(() => {
    return navigate(toTarget, { replace, state });
  }, [navigate, toTarget, replace, state]);

  return useMemo(
    () => ({
      route,
      href,
      isActive,
      isExactActive,
      navigate: navigateTo,
      to: toTarget,
      state,
    }),
    [route, href, isActive, isExactActive, navigateTo, toTarget, state],
  );
}
