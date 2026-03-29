import type { AfterEachGuard, GuardWithNextFn, NonNextFnGuard } from '../guards/guardManager';
import type { RouteLocation } from '../hooks/useRoute';
import type { RouterOptions } from '../hooks/useRouter';

/**
 * Vue Router compatible aliases that do not conflict with existing public names.
 * These are type-level adapters only.
 */
export type RouteLocationRaw = string | RouterOptions;
export type RouteLocationNormalized = RouteLocation;
export type RouteLocationNormalizedLoaded = RouteLocation;
export type RouteLocationResolved = RouteLocation;

export type NavigationGuard = GuardWithNextFn | NonNextFnGuard;
export type NavigationGuardNext = Parameters<GuardWithNextFn>[2];
export type NavigationHookAfter = AfterEachGuard;

export type RouteMeta = Record<string, any>;
export type LocationQueryRaw = Record<string, any>;
export type RouteRecordName = string;
