import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { matchPath, useNavigate } from 'react-router-dom';
import { RouteConfig } from '../creator/createRouter';
import { useGuardManager } from '../hooks/useGuardManager';
import { type RouteLocation } from '../hooks/useRoute';
import { createNavigationFailure, type NavigationFailure } from '../navigationFailure';
import { buildFullPath, getRouteByPath } from '../utils';
import { type ExclusiveGuards, type GuardRouteLocation } from './guardManager';

interface Props {
  outlet: ReactNode;
  route: RouteLocation;
  render: (outlet: ReactNode, finalRoute: RouteLocation) => ReactNode;
}

type ParentRouteConfigs = {
  pattern: string;
  isRedirect?: boolean;
} & ExclusiveGuards;

export function GuardExecutor({ render, outlet, route }: Props) {
  const navigate = useNavigate();
  const guardManager = useGuardManager();

  const isFirstMount = useRef(true);
  const outletRef = useRef(outlet);
  const prevRouteRef = useRef(route);

  const navigationStateRef = useRef({
    navigationId: 0,
  });

  const [finalRoute, setFinalRoute] = useState(route);
  const [guardApprovedOutlet, setGuardApprovedOutlet] = useState(outlet);

  const shouldTriggerBeforeEach = (from: RouteLocation, to: RouteLocation) =>
    from.fullPath !== to.fullPath;

  const shouldTriggerBeforeEnter = (
    sourceFromRoute: RouteConfig | null,
    sourceToRoute: RouteConfig | null,
    from: RouteLocation,
    to: RouteLocation,
  ) => {
    if (!sourceToRoute || sourceToRoute.redirect) return false;

    if (!sourceFromRoute) return true;

    if (
      sourceFromRoute.path !== sourceToRoute.path ||
      sourceFromRoute.name !== sourceToRoute.name
    ) {
      return true;
    }

    // same route record with params/query/hash updates should not trigger beforeEnter
    return from.path !== to.path && sourceFromRoute.path !== sourceToRoute.path;
  };

  const shouldTriggerBeforeRouteUpdate = (
    sourceFromRoute: RouteConfig | null,
    sourceToRoute: RouteConfig | null,
    from: RouteLocation,
    to: RouteLocation,
  ): boolean => {
    if (isFirstMount.current) return false;
    if (!sourceFromRoute || !sourceToRoute) return false;
    if (sourceFromRoute.path !== sourceToRoute.path) return false;

    return from.fullPath !== to.fullPath;
  };

  const getParentRouteInfo = (to: RouteLocation): ParentRouteConfigs[] => {
    const parentConfigs: ParentRouteConfigs[] = [];

    to.matched.slice(0, -1).forEach((matchedRecord) => {
      const pattern = matchedRecord.pathname;
      const routeConfig = getRouteByPath(pattern);

      if (routeConfig) {
        parentConfigs.push({
          pattern,
          beforeEnter: routeConfig.beforeEnter,
          isRedirect: !!routeConfig?.redirect,
        });
      }
    });

    return parentConfigs;
  };

  const isSameParentNavigation = (
    from: RouteLocation,
    to: RouteLocation,
    parentPattern: string,
  ): boolean => {
    const absolutePattern = parentPattern.startsWith('/') ? parentPattern : `/${parentPattern}`;

    const fromMatchesParent = matchPath({ path: absolutePattern, end: false }, from.path);
    const toMatchesParent = matchPath({ path: absolutePattern, end: false }, to.path);

    return !!(fromMatchesParent && toMatchesParent);
  };

  const handleGuardResult = useCallback(
    (result: any, from: GuardRouteLocation) => {
      if (typeof result === 'string') {
        navigate(result, { replace: true });
        return;
      }

      if (typeof result === 'object' && result && !(result instanceof Error)) {
        navigate(buildFullPath(result), {
          replace: true,
          state: result.state,
        });
        return;
      }

      navigate(from.fullPath, { replace: true, state: from.state });
    },
    [navigate],
  );

  const completeNavigation = useCallback(
    (to: RouteLocation, from: RouteLocation, failure?: NavigationFailure) => {
      if (!failure) {
        setFinalRoute(to);
        prevRouteRef.current = to;
        setGuardApprovedOutlet(outletRef.current);
      }

      guardManager.runAfterEach(to, from, failure);
    },
    [guardManager],
  );

  useEffect(() => {
    outletRef.current = outlet;
  }, [outlet]);

  useEffect(() => {
    if (!Object.is(guardApprovedOutlet, outlet)) {
      setGuardApprovedOutlet(outlet);
    }
  }, [guardApprovedOutlet, outlet]);

  useEffect(() => {
    let mounted = true;

    const currentNavigationId = ++navigationStateRef.current.navigationId;

    const runGuards = async () => {
      const toRoute = route;
      const fromRoute = prevRouteRef.current;

      if (fromRoute.fullPath === toRoute.fullPath) {
        return;
      }

      const isNavigationInvalid = () =>
        !mounted || currentNavigationId !== navigationStateRef.current.navigationId;

      const sourceToRoute = getRouteByPath(toRoute.path);
      const sourceFromRoute = getRouteByPath(fromRoute.path);

      try {
        if (!isFirstMount.current) {
          const leaveResult = await guardManager.runBeforeRouteLeave(toRoute, fromRoute);
          if (isNavigationInvalid()) return;
          if (leaveResult !== true) {
            const failure = guardManager.toFailure(leaveResult, toRoute, fromRoute);
            handleGuardResult(leaveResult, fromRoute);
            completeNavigation(toRoute, fromRoute, failure);
            return;
          }
        }

        if (shouldTriggerBeforeEach(fromRoute, toRoute)) {
          const beforeEachResult = await guardManager.runBeforeEach(toRoute, fromRoute);
          if (isNavigationInvalid()) return;
          if (beforeEachResult !== true) {
            const failure = guardManager.toFailure(beforeEachResult, toRoute, fromRoute);
            handleGuardResult(beforeEachResult, fromRoute);
            completeNavigation(toRoute, fromRoute, failure);
            return;
          }
        }

        if (shouldTriggerBeforeRouteUpdate(sourceFromRoute, sourceToRoute, fromRoute, toRoute)) {
          const updateResult = await guardManager.runBeforeRouteUpdate(toRoute, fromRoute);
          if (isNavigationInvalid()) return;
          if (updateResult !== true) {
            const failure = guardManager.toFailure(updateResult, toRoute, fromRoute);
            handleGuardResult(updateResult, fromRoute);
            completeNavigation(toRoute, fromRoute, failure);
            return;
          }
        }

        if (shouldTriggerBeforeEnter(sourceFromRoute, sourceToRoute, fromRoute, toRoute)) {
          if (toRoute.matched.length > 1) {
            const parentRouteInfo = getParentRouteInfo(toRoute);

            for (const { pattern, isRedirect, beforeEnter } of parentRouteInfo) {
              if (isNavigationInvalid()) return;

              if (isRedirect || !beforeEnter) continue;
              if (isSameParentNavigation(fromRoute, toRoute, pattern)) continue;

              const parentEnterResult = await guardManager.runBeforeEnter(
                toRoute,
                fromRoute,
                beforeEnter,
              );

              if (isNavigationInvalid()) return;

              if (parentEnterResult !== true) {
                const failure = guardManager.toFailure(parentEnterResult!, toRoute, fromRoute);
                handleGuardResult(parentEnterResult, fromRoute);
                completeNavigation(toRoute, fromRoute, failure);
                return;
              }
            }
          }

          if (sourceToRoute?.beforeEnter) {
            const beforeEnterResult = await guardManager.runBeforeEnter(
              toRoute,
              fromRoute,
              sourceToRoute.beforeEnter,
            );

            if (isNavigationInvalid()) return;

            if (beforeEnterResult !== true) {
              const failure = guardManager.toFailure(beforeEnterResult!, toRoute, fromRoute);
              handleGuardResult(beforeEnterResult, fromRoute);
              completeNavigation(toRoute, fromRoute, failure);
              return;
            }
          }
        }

        const beforeRouteEnterResult = await guardManager.runBeforeRouteEnter(toRoute, fromRoute);
        if (isNavigationInvalid()) return;
        if (beforeRouteEnterResult !== true) {
          const failure = guardManager.toFailure(beforeRouteEnterResult, toRoute, fromRoute);
          handleGuardResult(beforeRouteEnterResult, fromRoute);
          completeNavigation(toRoute, fromRoute, failure);
          return;
        }

        const beforeResolveResult = await guardManager.runBeforeResolve(toRoute, fromRoute);

        if (isNavigationInvalid()) return;

        if (beforeResolveResult !== true) {
          const failure = guardManager.toFailure(beforeResolveResult, toRoute, fromRoute);
          handleGuardResult(beforeResolveResult, fromRoute);
          completeNavigation(toRoute, fromRoute, failure);
          return;
        }

        completeNavigation(toRoute, fromRoute);
      } catch (error) {
        const failure = createNavigationFailure('error', {
          to: toRoute,
          from: fromRoute,
          error,
          message: '[Router] Error in navigation guards.',
        });

        guardManager.emitError(error);
        completeNavigation(toRoute, fromRoute, failure);
      } finally {
        if (isFirstMount.current) {
          isFirstMount.current = false;
        }
      }
    };

    runGuards();

    return () => {
      mounted = false;
    };
  }, [completeNavigation, guardManager, handleGuardResult, route]);

  return useMemo(
    () => render(guardApprovedOutlet, finalRoute),
    [finalRoute, guardApprovedOutlet, render],
  );
}
