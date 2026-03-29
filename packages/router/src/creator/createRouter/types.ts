import { type FunctionComponent, type ReactNode } from 'react';
import { type DataRouter, type NonIndexRouteObject, type RouteObject } from 'react-router-dom';
import { type ExclusiveGuards, type GlobalGuards } from '../../guards/guardManager';
import type { RouteLocation } from '../../hooks/useRoute';
import type { RouteLocationRaw } from '../../types/route-location';
import { type ComponentLoader } from '../createAsyncElement';
import { GlobalRouteConfig } from '../createClobalRouteConfig';
import { type RouterMode } from '../createHistory';

/**
 * Configuration options for creating a router instance.
 */
export interface RouterOptions {
  /**
   * Array of route configuration objects.
   * @see {@link RouteRecordRaw}
   */
  routes: RouteRecordRaw[];

  /**
   * Router mode (hash/history/abstract). Defaults to 'hash'.
   * @see {@link RouterMode}
   */
  history?: RouterMode;

  /**
   * Initial entries for in-memory history (useful for testing).
   */
  initialEntries?: string[];

  /**
   * Initial index for in-memory history.
   */
  initialIndex?: number;

  /**
   * Default CSS class for active links.
   */
  linkActiveClass?: string;

  /**
   * Default CSS class for exactly active links.
   */
  linkExactActiveClass?: string;

  /**
   * Custom function to parse query string into an object.
   * @param search - The query string to parse.
   */
  parseQuery?: (search: string) => Record<string, any>;

  /**
   * Custom function to stringify an object into a query string.
   * @param query - The query object to stringify.
   */
  stringifyQuery?: (query: Record<string, any>) => string;
}

/**
 * Extended route configuration with support for route-specific guards, lazy loading, and redirects.
 */
export interface RouteRecordRaw extends ExclusiveGuards {
  /**
   * Route path (supports dynamic segments).
   */
  path?: string;

  /**
   * Unique route name for named routes.
   */
  name?: string;

  /**
   * Arbitrary data that can be attached to the route.
   */
  state?: any;

  /**
   * Whether the route matching should be case-sensitive.
   */
  sensitive?: boolean;

  /**
   * Component to render. Can be a React node, a lazy loader, or a component type.
   * @see {@link ComponentType}
   */
  component?: ComponentType;

  /**
   * Nested route configurations.
   * @see {@link RouteRecordRaw}
   */
  children?: RouteRecordRaw[];

  /**
   * Custom CSS class for active links (overrides global setting).
   */
  linkActiveClassName?: string;

  /**
   * Custom CSS class for inactive links.
   */
  linkInActiveClassName?: string;

  /**
   * Custom CSS class for exactly active links (overrides global setting).
   */
  linkExactActiveClassName?: string;

  /**
   * Redirect configuration. Can be a string, options object, or a function that returns one.
   * @see {@link Redirect} 
   * @see {@link RedirectFunc} 
   */
  redirect?: Redirect | RedirectFunc;

  /**
   * Data loader function (React Router loader).
   */
  loader?: NonIndexRouteObject['loader'];

  /**
   * Route metadata. Can include a custom loading component.
   */
  meta?: {
    [key: string]: any;
    loadingComponent?: ReactNode;
  };
}

/**
 * Supported component types for route rendering.
 */
type ComponentType = ReactNode | ComponentLoader | FunctionComponent;

/**
 * Function that dynamically resolves a redirect target.
 */
type RedirectFunc = (to: RouteRecordRaw) => Redirect;

/**
 * Redirect target: a path string or an options object.
 */
type Redirect = string | RedirectOptions;

/**
 * Redirect options matching the `push` method in `useRouter`.
 */
type RedirectOptions = Exclude<RouteLocationRaw, string>;

/**
 * The public API of a router instance.
 */
export interface Router extends GlobalGuards {
  /**
   * Underlying React Router DataRouter instance.
   * @see {@link DataRouter}
   */
  router: DataRouter;

  /**
   * Router provider component to be used in the React tree.
   */
  RouterProvider: FunctionComponent;

  /**
   * Clears all routes and guards.
   */
  clearAll: () => void;

  /**
   * Returns the current route configuration (both source and transformed).
   */
  getRoutes: () => Readonly<GlobalRouteConfig>;

  addRoute: {
    /**
     * Adds a root-level route.
     */
    (route: RouteRecordRaw): void;

    /**
     * Adds a child route under the specified parent route name.
     * @param parentName - Name of the parent route.
     * @param route - Route configuration to add.
     */
    (parentName: string, route: RouteRecordRaw): void;
  };

  /**
   * Checks whether a route with the given name exists.
   * @param name - Route name to check.
   */
  hasRoute: (name: string) => boolean;

  /**
   * Resolves a target location into a normalized RouteLocation object.
   * @param to - Target location as a string or options object.
   */
  resolve: (to: RouteLocationRaw) => RouteLocation;

  push: (to: RouteLocationRaw) => void | Promise<void>;
  replace: (to: RouteLocationRaw) => void | Promise<void>;
  go: (delta: number) => void | Promise<void>;
  back: () => void | Promise<void>;
  forward: () => void | Promise<void>;
  current: string;
}

/**
 * Standard React Router route object type.
 */
export type ReactRoute = RouteObject;
