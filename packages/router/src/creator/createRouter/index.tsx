import { createElement, isValidElement, type ReactNode } from 'react';
import {
  matchRoutes,
  Navigate,
  type DataRouter,
  type NavigateOptions,
  type To,
} from 'react-router-dom';
import { type ErrorHandler, type GuardWithNextFn } from '../../guards/guardManager';
import type { RouteLocation, RouteLocationMatched } from '../../hooks/useRoute';
import { registerRuntimeRouterConfig, resetRuntimeRouterConfig } from '../../runtimeConfig';
import type { RouteLocationRaw } from '../../types/route-location';
import {
  buildFullPath,
  buildResolvedTo,
  buildSearchParams,
  findParentRoute,
  getRouteByPath,
  getRouteConfig,
  hasRouteByName,
  isPromise,
  isReactComponentType,
  normalizeRouterOptions,
  parseQueryString,
  resolvedPath,
} from '../../utils';
import { createAsyncElement } from '../createAsyncElement';
import {
  createRouteContainer,
  registerRouteConfig,
  resetRouteConfig,
} from '../createClobalRouteConfig';
import { createWebHashHistory, routerFactory } from '../createHistory';
import { createRouterProvider } from '../createRouterProvider';
import { type ReactRoute, type Router, type RouteRecordRaw, type RouterOptions } from './types';

export * from './types';

export function createRouter(options: RouterOptions): Router {
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

  const routeContainer = createRouteContainer();
  const convertedRoutes = routes.map(convertRoute);
  routeContainer.source = routes;
  routeContainer.converted = convertedRoutes;
  registerRouteConfig(routeContainer.source, routeContainer.converted);

  const routerCore = routerFactory(history, convertedRoutes, memoryRouterOpts);
  let guardManager: ReturnType<typeof createRouterProvider>['guardManager'];

  const getNavigateOptions = (to: RouteLocationRaw): NavigateOptions | undefined => {
    if (typeof to === 'string') return undefined;
    const { replace, ...opts } = to;
    return opts;
  };

  const addRoute: Router['addRoute'] = (
    parentOrRoute: string | RouteRecordRaw,
    maybeRoute?: RouteRecordRaw,
  ) => {
    const parentName = typeof parentOrRoute === 'string' ? parentOrRoute : undefined;
    const route = (
      typeof parentOrRoute === 'string' ? maybeRoute : parentOrRoute
    ) as RouteRecordRaw;

    if (!route) {
      throw new Error('[Router] addRoute requires a valid route config.');
    }

    appendSourceRoute(routeContainer, parentName, route);
    const converted = convertRoute(route);
    routeContainer.converted.push(converted);
    registerRouteConfig(routeContainer.source, routeContainer.converted);

    if (parentName) {
      routerCore.patchRoutes(parentName, [converted]);
      return;
    }

    routerCore.patchRoutes(null, [converted]);
  };

  const clearAll = () => {
    resetRouteConfig();
    resetRuntimeRouterConfig();
    guardManager.clear();
    routes.length = 0;
  };

  const router = {
    router: routerCore,
    RouterProvider: (() => null) as Router['RouterProvider'],
    clearAll,
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
    resolve(to: RouteLocationRaw) {
      return createLocationFrom(routerCore, to, routeContainer.converted);
    },
    push(to: RouteLocationRaw) {
      const currentPath = routerCore.state.location.pathname;
      const normalized = typeof to === 'string' ? to : normalizeRouterOptions(to, currentPath);
      return routerCore.navigate(buildFullPath(normalized, currentPath), getNavigateOptions(to));
    },
    replace(to: RouteLocationRaw) {
      const currentPath = routerCore.state.location.pathname;
      const normalized = typeof to === 'string' ? to : normalizeRouterOptions(to, currentPath);
      const options = getNavigateOptions(to) ?? {};
      return routerCore.navigate(buildFullPath(normalized, currentPath), {
        ...options,
        replace: true,
      });
    },
    go(delta: number) {
      return routerCore.navigate(delta);
    },
    back() {
      return routerCore.navigate(-1);
    },
    forward() {
      return routerCore.navigate(1);
    },
    current: '',
    getRoutes: getRouteConfig,
  } satisfies Router;

  Object.defineProperty(router, 'current', {
    enumerable: true,
    configurable: false,
    get() {
      const location = routerCore.state.location;
      return `${location.pathname}${location.search}${location.hash}`;
    },
  });

  const providerBundle = createRouterProvider(routerCore, router);
  guardManager = providerBundle.guardManager;
  router.RouterProvider = providerBundle.RouterProvider;

  return router;
}

function convertRoute(route: RouteRecordRaw): ReactRoute {
  const reactRoute: ReactRoute = {
    path: route.path,
    id: route.name,
    loader: route.loader,
    caseSensitive: route.sensitive,
    children: route.children?.map(convertRoute),
  };

  const handleElement = ({ component, meta }: RouteRecordRaw): ReactNode => {
    if (isValidElement(component)) {
      return component;
    }

    if (isReactComponentType(component)) {
      return createElement(component);
    }

    if (typeof component === 'function') {
      try {
        const result = component();

        if (isPromise(result)) {
          return createAsyncElement(component, meta?.loadingComponent);
        }

        if (isValidElement(result)) {
          return result;
        }

        return result;
      } catch {
        return createAsyncElement(component, meta?.loadingComponent);
      }
    }

    return component;
  };

  const handleRedirect = (to: RouteRecordRaw, redirect: RouteRecordRaw['redirect']): ReactNode => {
    if (typeof redirect === 'function') {
      return handleRedirect(to, redirect(to));
    }

    if (typeof redirect === 'string') {
      return <Navigate to={redirect} replace />;
    }

    if (typeof redirect === 'object' && redirect) {
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
  to: RouteLocationRaw,
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
    params: matched[matchedLastIndex(matched)]?.params ?? {},
    hash: resolved.hash,
    meta,
    state: resolved.state,
    fullPath,
    query,
    matched,
  };
}

function matchedLastIndex<T>(arr: T[]): number {
  return arr.length > 0 ? arr.length - 1 : 0;
}

function appendSourceRoute(
  routeContainer: ReturnType<typeof createRouteContainer>,
  parentName: string | undefined,
  route: RouteRecordRaw,
) {
  if (!parentName) {
    pushUniqueRoute(routeContainer.source, route);
    return;
  }

  const parent = findParentRoute(parentName);
  if (!parent) {
    throw new Error(`[Router] Parent route with name "${parentName}" not found.`);
  }

  parent.children ??= [];
  pushUniqueRoute(parent.children, route);
}

function pushUniqueRoute(list: RouteRecordRaw[], route: RouteRecordRaw) {
  if (route.name && list.some((item) => item.name === route.name)) {
    throw new Error(`[Router] Route with name "${route.name}" already exists.`);
  }
  list.push(route);
}
