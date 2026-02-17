import { useMemo } from 'react';
import { type Params, useLocation, useMatches, useParams } from 'react-router-dom';
import { useOptionalRouterContext } from '../context/RouterContext';
import { getRouteByPath, parseQueryString } from '../utils';

export interface RouteLocationMatched {
  name: string;
  pathname: string;
  path?: string;
  params: Params;
  meta?: Record<string, any>;
}

export interface RouteLocation {
  name: string;
  path: string;
  params: Params;
  hash: string;
  meta: Record<string, any>;
  state: any;
  fullPath: string;
  query: Record<string, any>;
  redirectedFrom?: string;
  matched: RouteLocationMatched[];
}

export function useRoute(): RouteLocation {
  const { hash, search, pathname, state } = useLocation();
  const context = useOptionalRouterContext();
  const guardManager = context?.guardManager;

  const params = useParams();
  const matches = useMatches();

  const query = useMemo(() => parseQueryString(search), [search]);

  const fullPath = useMemo(() => pathname + search + hash, [pathname, search, hash]);

  const matched = useMemo<RouteLocationMatched[]>(
    () =>
      matches.map(({ id, params: currentParams, pathname: currentPathname }) => {
        const config = getRouteByPath(currentPathname);
        return {
          name: id,
          pathname: currentPathname,
          path: config?.path,
          params: currentParams,
          meta: config?.meta,
        };
      }),
    [matches],
  );

  const config = getRouteByPath(pathname);
  const name = config?.name || '';

  const meta = matched.reduce<Record<string, any>>((acc, current) => {
    if (current.meta) {
      Object.assign(acc, current.meta);
    }
    return acc;
  }, {});

  const latestTransition = guardManager?.getLatestTransition();
  const redirectedFrom = latestTransition?.failure?.type === 'redirected' ? latestTransition.from.fullPath : undefined;

  return {
    name,
    path: pathname,
    params,
    query,
    hash,
    meta,
    state,
    fullPath,
    redirectedFrom,
    matched,
  };
}

