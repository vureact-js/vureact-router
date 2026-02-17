import { type FunctionComponent, type ReactNode } from 'react';
import {
  Navigate,
  matchRoutes,
  type DataRouter,
  type NonIndexRouteObject,
  type RouteObject,
  type To,
} from 'react-router-dom';
import {
  type ErrorHandler,
  type ExclusiveGuards,
  type GlobalGuards,
  type GuardWithNextFn,
} from '../guards/guardManager';
import type { RouteLocation, RouteLocationMatched } from '../hooks/useRoute';
import { type RouterOptions as RouterHookOptions } from '../hooks/useRouter';
import { registerRuntimeRouterConfig, resetRuntimeRouterConfig } from '../runtimeConfig';
import {
  buildResolvedTo,
  buildSearchParams,
  findParentRoute,
  getRouteByPath,
  getRouteConfig,
  hasRouteByName,
  isPromise,
  parseQueryString,
  resolvedPath,
} from '../utils';
import { createAsyncElement, type ComponentLoader } from './createAsyncElement';
import {
  registerRouteConfig,
  resetRouteConfig,
  type GlobalRouteConfig,
} from './createClobalRouteConfig';
import { createWebHashHistory, routerFactory, type RouterMode } from './createHistory';
import { createRouterProvider } from './createRouterProvider';

export interface CreateRouterOptions {
  routes: RouteConfig[];
  history?: RouterMode;
  initialEntries?: string[];
  initialIndex?: number;
  linkActiveClass?: string;
  linkExactActiveClass?: string;
  parseQuery?: (search: string) => Record<string, any>;
  stringifyQuery?: (query: Record<string, any>) => string;
}

export interface RouteConfig extends ExclusiveGuards {
  path?: string;
  name?: string;
  state?: any;
  sensitive?: boolean;
  component?: ComponentType;
  children?: RouteConfig[];
  linkActiveClassName?: string;
  linkInActiveClassName?: string;
  linkExactActiveClassName?: string;
  redirect?: Redirect | RedirectFunc;
  loader?: NonIndexRouteObject['loader'];
  meta?: { [x: string]: any; loadingComponent?: ReactNode };
}

type ComponentType = ReactNode | ComponentLoader;

type RedirectFunc = (to: RouteConfig) => Redirect;

type Redirect = string | RedirectOptions;

type RedirectOptions = RouterHookOptions;

export interface RouterInstance extends GlobalGuards {
  router: DataRouter;
  RouterProvider: FunctionComponent;
  clearAll: () => void;
  getRoutes: () => Readonly<GlobalRouteConfig>;
  addRoute: {
    (route: RouteConfig): void;
    (parentName: string, route: RouteConfig): void;
  };
  hasRoute: (name: string) => boolean;
  resolve: (to: string | RouterHookOptions) => RouteLocation;
}

export type ReactRoute = RouteObject;

function convertRoute(route: RouteConfig): ReactRoute {
  const reactRoute: ReactRoute = {
    path: route.path,
    id: route.name,
    loader: route.loader,
    caseSensitive: route.sensitive,
    children: route.children?.map(convertRoute),
  };

  const handleElement = ({ component, meta }: RouteConfig): ReactNode => {
    if (typeof component === 'function') {
      try {
        if (isPromise(component())) {
          return createAsyncElement(component as ComponentLoader, meta?.loadingComponent);
        }
      } catch {
        // ignore invalid lazy component probe and treat as sync component
      }
    }
    return component as ReactNode;
  };

  const handleRedirect = (to: RouteConfig, redirect: RouteConfig['redirect']): ReactNode => {
    if (typeof redirect === 'function') {
      return handleRedirect(to, redirect(to));
    }

    if (typeof redirect === 'string') {
      return <Navigate to={redirect} replace />;
    }

    if (typeof redirect === 'object') {
      const targetTo: To = {
        hash: redirect.hash,
        pathname: resolvedPath(redirect),
        search: buildSearchParams(redirect.query),
      };

      return <Navigate to={targetTo} state={redirect.state} replace />;
    }

    return null;
  };

  reactRoute.element = route.redirect
    ? handleRedirect(route, route.redirect)
    : handleElement(route);

  return reactRoute;
}

function createLocationFrom(
  router: DataRouter,
  to: string | RouterHookOptions,
  sourceConvertedRoutes: ReactRoute[],
): RouteLocation {
  const current = router.state.location;
  const resolved = buildResolvedTo(to, current.pathname);
  const fullPath = `${resolved.pathname}${resolved.search}${resolved.hash}`;
  const query = parseQueryString(resolved.search);
  const route = getRouteByPath(resolved.pathname);

  const matches =
    matchRoutes(sourceConvertedRoutes, {
      pathname: resolved.pathname,
      search: resolved.search,
      hash: resolved.hash,
    }) ?? [];

  const matched = matches.map<RouteLocationMatched>((matchedRecord) => {
    const record = getRouteByPath(matchedRecord.pathname);
    return {
      name: matchedRecord.route.id || '',
      pathname: matchedRecord.pathname,
      path: record?.path,
      params: matchedRecord.params,
      meta: record?.meta,
    };
  });

  const meta = matched.reduce<Record<string, any>>((acc, currentMatch) => {
    if (currentMatch.meta) {
      Object.assign(acc, currentMatch.meta);
    }
    return acc;
  }, {});

  return {
    name: route?.name || '',
    path: resolved.pathname,
    params: matched[machedLastIndex(matched)]?.params ?? {},
    hash: resolved.hash,
    meta,
    state: resolved.state,
    fullPath,
    query,
    matched,
  };
}

function machedLastIndex<T>(arr: T[]): number {
  return arr.length > 0 ? arr.length - 1 : 0;
}

function appendSourceRoute(parentName: string | undefined, route: RouteConfig) {
  if (!parentName) {
    _pushUniqueRoute(_ROUTE_CONTAINER_.source, route);
    return;
  }

  const parent = findParentRoute(parentName);
  if (!parent) {
    throw new Error(`[Router] Parent route with name "${parentName}" not found.`);
  }

  parent.children ??= [];
  _pushUniqueRoute(parent.children, route);
}

const _ROUTE_CONTAINER_ = {
  source: [] as RouteConfig[],
  converted: [] as ReactRoute[],
};

function _pushUniqueRoute(list: RouteConfig[], route: RouteConfig) {
  if (route.name && list.some((item) => item.name === route.name)) {
    throw new Error(`[Router] Route with name "${route.name}" already exists.`);
  }
  list.push(route);
}

export function createRouter(options: CreateRouterOptions): RouterInstance {
  const {
    history = createWebHashHistory(),
    routes,
    linkActiveClass,
    linkExactActiveClass,
    parseQuery,
    stringifyQuery,
    ...memoryRouterOpts
  } = options;

  registerRuntimeRouterConfig({
    linkActiveClass: linkActiveClass ?? 'router-link-active',
    linkExactActiveClass: linkExactActiveClass ?? 'router-link-exact-active',
    parseQuery,
    stringifyQuery,
  });

  const convertedRoutes = routes.map(convertRoute);

  _ROUTE_CONTAINER_.source = routes;
  _ROUTE_CONTAINER_.converted = convertedRoutes;

  registerRouteConfig(_ROUTE_CONTAINER_.source, _ROUTE_CONTAINER_.converted);

  const router = routerFactory(history, convertedRoutes, memoryRouterOpts);
  const { guardManager, RouterProvider } = createRouterProvider(router);

  const addRoute: RouterInstance['addRoute'] = (
    parentOrRoute: string | RouteConfig,
    maybeRoute?: RouteConfig,
  ) => {
    const parentName = typeof parentOrRoute === 'string' ? parentOrRoute : undefined;
    const route = (typeof parentOrRoute === 'string' ? maybeRoute : parentOrRoute) as RouteConfig;

    if (!route) {
      throw new Error('[Router] addRoute requires a valid route config.');
    }

    appendSourceRoute(parentName, route);

    const converted = convertRoute(route);
    _ROUTE_CONTAINER_.converted.push(converted);
    registerRouteConfig(_ROUTE_CONTAINER_.source, _ROUTE_CONTAINER_.converted);

    if (parentName) {
      router.patchRoutes(parentName, [converted]);
      return;
    }

    router.patchRoutes(null, [converted]);
  };

  const clearAll = () => {
    resetRouteConfig();
    resetRuntimeRouterConfig();
    guardManager.clear();
    routes.length = 0;
  };

  return {
    router,
    clearAll,
    RouterProvider,
    beforeEach(guard: GuardWithNextFn) {
      return guardManager.registerGuard('beforeEachGuards', guard);
    },
    beforeResolve(guard: GuardWithNextFn) {
      return guardManager.registerGuard('beforeResolveGuards', guard);
    },
    afterEach(guard) {
      return guardManager.registerGuard('afterEachGuards', guard);
    },
    onError(handler: ErrorHandler) {
      return guardManager.registerOnError(handler);
    },
    addRoute,
    hasRoute(name: string) {
      return hasRouteByName(name);
    },
    resolve(to: string | RouterHookOptions) {
      return createLocationFrom(router, to, _ROUTE_CONTAINER_.converted);
    },
    getRoutes: getRouteConfig,
  };
}
