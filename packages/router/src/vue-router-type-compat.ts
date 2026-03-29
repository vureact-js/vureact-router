import type {
  CreateRouterOptions,
  RouteConfig,
  RouterInstance,
} from './creator/createRouter/types';
import type { NavigationFailureType as InternalNavigationFailureType } from './navigationFailure';

export type {
  LocationQueryRaw,
  NavigationGuard,
  NavigationGuardNext,
  NavigationHookAfter,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteLocationRaw,
  RouteLocationResolved,
  RouteMeta,
  RouteRecordName,
} from './types/vue-router-alias';

/**
 * Vue Router compatible alias.
 * Note: this maps to vureact-router's RouteConfig.
 */
export type RouteRecordRaw = RouteConfig;

/**
 * Vue Router compatible alias.
 * Note: this maps to vureact-router's RouterInstance.
 */
export type Router = RouterInstance;

/**
 * Vue Router compatible alias.
 * Note: this maps to createRouter options, not navigation target options.
 */
export type RouterOptions = CreateRouterOptions;

/**
 * Vue Router compatible alias.
 * `duplicated` is included for type migration compatibility only.
 */
export type NavigationFailureType = InternalNavigationFailureType | 'duplicated';
