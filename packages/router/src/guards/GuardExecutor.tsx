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

/**
 * 路由守卫执行器组件
 * 负责执行路由导航过程中的各种守卫钩子函数
 * 包括 beforeEach、beforeEnter、beforeRouteUpdate 等
 */
export function GuardExecutor({ render, outlet, route }: Props) {
  const navigate = useNavigate();
  const guardManager = useGuardManager();

  // 用于跟踪组件是否是首次挂载
  const isFirstMount = useRef(true);
  // 缓存 outlet 和上一个路由，用于比较和状态管理
  const outletRef = useRef(outlet);
  const prevRouteRef = useRef(route);

  // 导航状态引用，用于处理并发导航的竞态条件
  const navigationStateRef = useRef({
    navigationId: 0,
  });

  // 最终通过守卫的路由和 outlet
  const [finalRoute, setFinalRoute] = useState(route);
  const [guardApprovedOutlet, setGuardApprovedOutlet] = useState(outlet);

  // 判断是否需要触发 beforeEach 守卫
  const shouldTriggerBeforeEach = (from: RouteLocation, to: RouteLocation) =>
    from.fullPath !== to.fullPath;

  // 判断是否需要触发 beforeEnter 守卫
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

    // 相同路由记录但参数/查询/哈希更新时不应触发 beforeEnter
    return from.path !== to.path && sourceFromRoute.path !== sourceToRoute.path;
  };

  // 判断是否需要触发 beforeRouteUpdate 守卫
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

  // 获取父级路由信息
  const getParentRouteInfo = (to: RouteLocation): ParentRouteConfigs[] => {
    const parentConfigs: ParentRouteConfigs[] = [];

    // 遍历匹配的路由记录（排除最后一个，即当前路由）
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

  // 判断是否在同一父级路由内导航
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

  // 处理守卫函数返回的结果
  const handleGuardResult = useCallback(
    (result: any, from: GuardRouteLocation) => {
      // 如果返回字符串，导航到该路径
      if (typeof result === 'string') {
        navigate(result, { replace: true });
        return;
      }

      // 如果返回对象，导航到构建的完整路径
      if (typeof result === 'object' && result && !(result instanceof Error)) {
        navigate(buildFullPath(result), {
          replace: true,
          state: result.state,
        });
        return;
      }

      // 否则返回原路由
      navigate(from.fullPath, { replace: true, state: from.state });
    },
    [navigate],
  );

  // 完成导航，更新状态并触发 afterEach
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

  // 更新 outlet 引用
  useEffect(() => {
    outletRef.current = outlet;
  }, [outlet]);

  // 同步 guardApprovedOutlet 和 outlet
  useEffect(() => {
    if (!Object.is(guardApprovedOutlet, outlet)) {
      setGuardApprovedOutlet(outlet);
    }
  }, [guardApprovedOutlet, outlet]);

  // 主守卫执行逻辑
  useEffect(() => {
    let mounted = true;

    // 为当前导航分配唯一 ID，处理竞态条件
    const currentNavigationId = ++navigationStateRef.current.navigationId;

    const runGuards = async () => {
      const toRoute = route;
      const fromRoute = prevRouteRef.current;

      // 如果路径相同，跳过守卫执行
      if (fromRoute.fullPath === toRoute.fullPath) {
        return;
      }

      // 检查导航是否已失效（组件卸载或新导航开始）
      const isNavigationInvalid = () =>
        !mounted || currentNavigationId !== navigationStateRef.current.navigationId;

      const sourceToRoute = getRouteByPath(toRoute.path);
      const sourceFromRoute = getRouteByPath(fromRoute.path);

      try {
        // 1. 如果不是首次挂载，执行 beforeRouteLeave
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

        // 2. 执行 beforeEach（全局前置守卫）
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

        // 3. 执行 beforeRouteUpdate（路由更新守卫）
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

        // 4. 执行 beforeEnter（路由独享守卫）
        if (shouldTriggerBeforeEnter(sourceFromRoute, sourceToRoute, fromRoute, toRoute)) {
          // 4.1 执行父级路由的 beforeEnter
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

          // 4.2 执行当前路由的 beforeEnter
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

        // 5. 执行 beforeRouteEnter（组件内守卫）
        const beforeRouteEnterResult = await guardManager.runBeforeRouteEnter(toRoute, fromRoute);
        if (isNavigationInvalid()) return;
        if (beforeRouteEnterResult !== true) {
          const failure = guardManager.toFailure(beforeRouteEnterResult, toRoute, fromRoute);
          handleGuardResult(beforeRouteEnterResult, fromRoute);
          completeNavigation(toRoute, fromRoute, failure);
          return;
        }

        // 6. 执行 beforeResolve（解析完成前的守卫）
        const beforeResolveResult = await guardManager.runBeforeResolve(toRoute, fromRoute);

        if (isNavigationInvalid()) return;

        if (beforeResolveResult !== true) {
          const failure = guardManager.toFailure(beforeResolveResult, toRoute, fromRoute);
          handleGuardResult(beforeResolveResult, fromRoute);
          completeNavigation(toRoute, fromRoute, failure);
          return;
        }

        // 7. 所有守卫通过，完成导航
        completeNavigation(toRoute, fromRoute);
      } catch (error) {
        // 处理守卫执行过程中的错误
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

  // 使用 useMemo 优化渲染性能
  return useMemo(
    () => render(guardApprovedOutlet, finalRoute),
    [finalRoute, guardApprovedOutlet, render],
  );
}
