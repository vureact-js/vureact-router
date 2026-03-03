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

/**
 * 创建路由时的配置选项
 */
export interface CreateRouterOptions {
  routes: RouteConfig[]; // 路由配置数组
  history?: RouterMode; // 路由模式（hash/history/abstract），默认 hash
  initialEntries?: string[]; // 内存历史初始条目（用于测试）
  initialIndex?: number; // 内存历史初始索引
  linkActiveClass?: string; // 激活链接的默认类名
  linkExactActiveClass?: string; // 精确激活链接的默认类名
  parseQuery?: (search: string) => Record<string, any>; // 自定义查询字符串解析函数
  stringifyQuery?: (query: Record<string, any>) => string; // 自定义查询字符串序列化函数
}

/**
 * 自定义路由配置，扩展自 ExclusiveGuards（路由独享守卫）
 */
export interface RouteConfig extends ExclusiveGuards {
  path?: string; // 路由路径（支持动态段）
  name?: string; // 路由名称，用于命名路由
  state?: any; // 默认状态
  sensitive?: boolean; // 是否大小写敏感
  component?: ComponentType; // 组件（可以是 ReactNode 或异步加载函数）
  children?: RouteConfig[]; // 子路由
  linkActiveClassName?: string; // 自定义激活类名（覆盖全局）
  linkInActiveClassName?: string; // 自定义非激活类名
  linkExactActiveClassName?: string; // 自定义精确激活类名
  redirect?: Redirect | RedirectFunc; // 重定向配置
  loader?: NonIndexRouteObject['loader']; // 路由数据加载器（React Router 的 loader）
  meta?: { [x: string]: any; loadingComponent?: ReactNode }; // 路由元信息，可包含 loading 组件
}

type ComponentType = ReactNode | ComponentLoader; // 组件可以是普通节点或加载器函数

type RedirectFunc = (to: RouteConfig) => Redirect; // 动态重定向函数

type Redirect = string | RedirectOptions; // 重定向目标：字符串路径或选项对象

type RedirectOptions = RouterHookOptions; // 重定向选项（与 useRouter 的 push 选项一致）

/**
 * 返回的路由实例接口，包含导航守卫、动态添加路由等方法
 */
export interface RouterInstance extends GlobalGuards {
  router: DataRouter; // React Router 的底层 router 实例
  RouterProvider: FunctionComponent; // 路由提供者组件
  clearAll: () => void; // 清空所有路由配置和守卫
  getRoutes: () => Readonly<GlobalRouteConfig>; // 获取当前路由配置（源路由和转换后路由）
  addRoute: {
    (route: RouteConfig): void; // 添加根路由
    (parentName: string, route: RouteConfig): void; // 在指定父路由下添加子路由
  };
  hasRoute: (name: string) => boolean; // 检查是否存在指定名称的路由
  resolve: (to: string | RouterHookOptions) => RouteLocation; // 解析目标位置，返回 RouteLocation 对象
}

export type ReactRoute = RouteObject; // React Router 的标准路由对象

// 存储源路由和转换后路由的容器（内部使用）
const _ROUTE_CONTAINER_ = {
  source: [] as RouteConfig[], // 原始路由配置
  converted: [] as ReactRoute[], // 转换后的 React Router 路由对象
};

/**
 * React adapter for Vue Router's createRouter.
 * @see https://router.vureact.top/guide/basic-routing.html
 */
export function createRouter(options: CreateRouterOptions): RouterInstance {
  const {
    history = createWebHashHistory(), // 默认使用 hash 模式
    routes,
    linkActiveClass,
    linkExactActiveClass,
    parseQuery,
    stringifyQuery,
    ...memoryRouterOpts
  } = options;

  // 注册全局运行时配置（如激活类名、查询解析函数等）
  registerRuntimeRouterConfig({
    linkActiveClass: linkActiveClass ?? 'router-link-active',
    linkExactActiveClass: linkExactActiveClass ?? 'router-link-exact-active',
    parseQuery,
    stringifyQuery,
  });

  // 转换初始路由
  const convertedRoutes = routes.map(convertRoute);

  // 保存到内部容器
  _ROUTE_CONTAINER_.source = routes;
  _ROUTE_CONTAINER_.converted = convertedRoutes;

  // 注册路由配置到全局，供其他模块（如 useRoute）使用
  registerRouteConfig(_ROUTE_CONTAINER_.source, _ROUTE_CONTAINER_.converted);

  // 创建 React Router 的 router 实例
  const router = routerFactory(history, convertedRoutes, memoryRouterOpts);
  // 创建路由 Provider 和守卫管理器
  const { guardManager, RouterProvider } = createRouterProvider(router);

  /**
   * 动态添加路由
   * 可指定父路由名称（可选），若不指定则添加到根级别
   */
  const addRoute: RouterInstance['addRoute'] = (
    parentOrRoute: string | RouteConfig,
    maybeRoute?: RouteConfig,
  ) => {
    const parentName = typeof parentOrRoute === 'string' ? parentOrRoute : undefined;
    const route = (typeof parentOrRoute === 'string' ? maybeRoute : parentOrRoute) as RouteConfig;

    if (!route) {
      throw new Error('[Router] addRoute requires a valid route config.');
    }

    // 将路由配置添加到源容器（检查名称唯一性）
    appendSourceRoute(parentName, route);

    // 转换为 React Router 路由对象
    const converted = convertRoute(route);
    _ROUTE_CONTAINER_.converted.push(converted);
    // 重新注册路由配置（更新全局配置）
    registerRouteConfig(_ROUTE_CONTAINER_.source, _ROUTE_CONTAINER_.converted);

    // 调用 React Router 的 patchRoutes 动态添加路由
    if (parentName) {
      router.patchRoutes(parentName, [converted]); // 添加到指定父路由下
      return;
    }
    router.patchRoutes(null, [converted]); // 添加到根路由
  };

  /**
   * 清空所有路由配置和守卫（用于测试或重置）
   */
  const clearAll = () => {
    resetRouteConfig(); // 清空全局路由配置
    resetRuntimeRouterConfig(); // 清空运行时配置
    guardManager.clear(); // 清空所有守卫
    routes.length = 0; // 清空原始路由数组
  };

  // 返回路由实例，包含所有公共方法
  return {
    router,
    clearAll,
    RouterProvider,
    // 注册全局前置守卫
    beforeEach(guard: GuardWithNextFn) {
      return guardManager.registerGuard('beforeEachGuards', guard);
    },
    // 注册全局解析守卫
    beforeResolve(guard: GuardWithNextFn) {
      return guardManager.registerGuard('beforeResolveGuards', guard);
    },
    // 注册全局后置钩子
    afterEach(guard) {
      return guardManager.registerGuard('afterEachGuards', guard);
    },
    // 注册错误处理函数
    onError(handler: ErrorHandler) {
      return guardManager.registerOnError(handler);
    },
    addRoute,
    // 检查是否存在指定名称的路由
    hasRoute(name: string) {
      return hasRouteByName(name);
    },
    // 解析目标位置，返回 RouteLocation 对象
    resolve(to: string | RouterHookOptions) {
      return createLocationFrom(router, to, _ROUTE_CONTAINER_.converted);
    },
    // 获取当前路由配置（只读）
    getRoutes: getRouteConfig,
  };
}

/**
 * 将自定义 RouteConfig 转换为 React Router 的 RouteObject
 * @param route 自定义路由配置
 * @returns 适用于 React Router 的路由对象
 */
function convertRoute(route: RouteConfig): ReactRoute {
  const reactRoute: ReactRoute = {
    path: route.path,
    id: route.name, // 使用 name 作为 React Router 的 id，便于后续引用
    loader: route.loader,
    caseSensitive: route.sensitive,
    children: route.children?.map(convertRoute), // 递归转换子路由
  };

  /**
   * 处理路由组件：支持同步组件和异步懒加载组件
   * @param param0 路由配置
   * @returns 渲染的 ReactNode
   */
  const handleElement = ({ component, meta }: RouteConfig): ReactNode => {
    if (typeof component === 'function') {
      try {
        // 判断函数调用结果是否为 Promise，若是则视为异步组件
        if (isPromise(component())) {
          return createAsyncElement(component as ComponentLoader, meta?.loadingComponent);
        }
      } catch {
        // 如果函数调用抛出异常（可能因为懒加载函数在调用时才真正加载），忽略并当作同步处理
      }
    }
    return component as ReactNode; // 直接返回 ReactNode
  };

  /**
   * 处理重定向配置：支持字符串、对象和函数形式
   * @param to 当前路由配置
   * @param redirect 重定向配置
   * @returns 渲染的 Navigate 组件或 null
   */
  const handleRedirect = (to: RouteConfig, redirect: RouteConfig['redirect']): ReactNode => {
    if (typeof redirect === 'function') {
      // 若为重定向函数，则递归调用获取最终配置
      return handleRedirect(to, redirect(to));
    }

    if (typeof redirect === 'string') {
      // 字符串路径：直接使用 Navigate 跳转
      return <Navigate to={redirect} replace />;
    }

    if (typeof redirect === 'object') {
      // 对象形式：可包含 path、query、hash、state 等
      const targetTo: To = {
        hash: redirect.hash,
        pathname: resolvedPath(redirect), // 解析路径（处理相对路径）
        search: buildSearchParams(redirect.query), // 将 query 对象转为查询字符串
      };
      return <Navigate to={targetTo} state={redirect.state} replace />;
    }

    return null;
  };

  // 优先处理重定向，若无重定向则处理组件
  reactRoute.element = route.redirect
    ? handleRedirect(route, route.redirect)
    : handleElement(route);

  return reactRoute;
}

/**
 * 根据目标 to 和当前 router 状态生成 RouteLocation 对象
 * @param router React Router 的 DataRouter 实例
 * @param to 目标路径或路由选项
 * @param sourceConvertedRoutes 转换后的路由数组（用于匹配）
 * @returns 标准化的路由位置对象
 */
function createLocationFrom(
  router: DataRouter,
  to: string | RouterHookOptions,
  sourceConvertedRoutes: ReactRoute[],
): RouteLocation {
  // 获取当前路由位置
  const current = router.state.location;
  // 解析目标路由，处理相对路径、查询参数等
  const resolved = buildResolvedTo(to, current.pathname);
  // 构建完整路径（包含查询字符串和哈希）
  const fullPath = `${resolved.pathname}${resolved.search}${resolved.hash}`;
  // 解析查询字符串为对象
  const query = parseQueryString(resolved.search);
  // 根据路径查找对应的路由配置（从源路由中）
  const route = getRouteByPath(resolved.pathname);

  // 使用 React Router 的 matchRoutes 匹配路由，返回匹配的路由记录数组
  const matches =
    matchRoutes(sourceConvertedRoutes, {
      pathname: resolved.pathname,
      search: resolved.search,
      hash: resolved.hash,
    }) ?? [];

  // 将匹配记录转换为内部 RouteLocationMatched 格式
  const matched = matches.map<RouteLocationMatched>((matchedRecord) => {
    // 根据匹配的路径名查找路由配置（获取 meta 等信息）
    const record = getRouteByPath(matchedRecord.pathname);
    return {
      name: matchedRecord.route.id || '', // 路由名称（对应 React Router 的 id）
      pathname: matchedRecord.pathname, // 匹配的完整路径名
      path: record?.path, // 路由配置中的路径模式
      params: matchedRecord.params, // 动态路由参数
      meta: record?.meta, // 路由元信息
    };
  });

  // 合并所有匹配路由的 meta 信息，子路由的 meta 会覆盖父路由的同名属性
  const meta = matched.reduce<Record<string, any>>((acc, currentMatch) => {
    if (currentMatch.meta) {
      Object.assign(acc, currentMatch.meta);
    }
    return acc;
  }, {});

  // 返回完整的路由位置对象，类似于 Vue Router 的 RouteLocation
  return {
    name: route?.name || '', // 路由名称
    path: resolved.pathname, // 路径名（不含查询字符串和哈希）
    params: matched[matchedLastIndex(matched)]?.params ?? {}, // 取最后一个匹配路由的参数（最具体）
    hash: resolved.hash, // 哈希值
    meta, // 合并后的元信息
    state: resolved.state, // 路由状态（通过 state 传递的数据）
    fullPath, // 完整路径（包含查询字符串和哈希）
    query, // 查询参数对象
    matched, // 所有匹配的路由记录
  };
}

/**
 * 获取数组最后一个元素的索引，若数组为空则返回 0
 * @param arr 任意数组
 * @returns 最后一个索引或 0
 */
function matchedLastIndex<T>(arr: T[]): number {
  return arr.length > 0 ? arr.length - 1 : 0;
}

/**
 * 将新路由添加到源路由容器中，处理父路由关系
 * @param parentName 父路由名称（可选）
 * @param route 要添加的路由配置
 */
function appendSourceRoute(parentName: string | undefined, route: RouteConfig) {
  if (!parentName) {
    // 无父路由，作为根路由添加
    _pushUniqueRoute(_ROUTE_CONTAINER_.source, route);
    return;
  }

  // 查找父路由配置
  const parent = findParentRoute(parentName);
  if (!parent) {
    throw new Error(`[Router] Parent route with name "${parentName}" not found.`);
  }

  // 确保父路由有 children 数组
  parent.children ??= [];
  _pushUniqueRoute(parent.children, route);
}

/**
 * 向路由列表中添加路由，并检查名称唯一性
 * @param list 目标路由列表
 * @param route 要添加的路由配置
 * @throws 如果路由名称已存在则抛出错误
 */
function _pushUniqueRoute(list: RouteConfig[], route: RouteConfig) {
  if (route.name && list.some((item) => item.name === route.name)) {
    throw new Error(`[Router] Route with name "${route.name}" already exists.`);
  }
  list.push(route);
}
