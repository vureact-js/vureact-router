import { FunctionComponent, isValidElement } from 'react';
import { matchPath, type Params, type Path } from 'react-router-dom';
import { _ROUTE_CONFIG_, type GlobalRouteConfig } from './creator/createClobalRouteConfig';
import type { RouteRecordRaw } from './creator/createRouter';
import type { RouteLocationOptions, RouteLocationRaw } from './types/route-location';
import { getRuntimeRouterConfig } from './runtimeConfig';

export type ResolvedTo = {
  pathname: string;
  search: string;
  hash: string;
  state?: any;
  replace?: boolean;
};

export function parseQueryString(search: string): Record<string, any> {
  return getRuntimeRouterConfig().parseQuery(search);
}

export function stringifyQuery(query?: Record<string, any>): string {
  if (!query) return '';
  return getRuntimeRouterConfig().stringifyQuery(query);
}

export const buildFullPath = (to: RouteLocationRaw, currentPath = '/'): string => {
  if (typeof to === 'string') {
    return to;
  }

  const normalized = normalizeRouterOptions(to, currentPath);
  const { query, hash } = normalized;
  const queryString = buildSearchParams(query);

  return (
    resolvedPath(normalized) +
    (queryString ?? '') +
    (hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '')
  );
};

export function buildResolvedTo(to: RouteLocationRaw, currentPath = '/'): ResolvedTo {
  if (typeof to === 'string') {
    const [pathPart, hashPart = ''] = to.split('#');
    const [pathname, searchPart = ''] = pathPart!.split('?');
    return {
      pathname: pathname || currentPath,
      search: searchPart ? `?${searchPart}` : '',
      hash: hashPart ? `#${hashPart}` : '',
    };
  }

  const normalized = normalizeRouterOptions(to, currentPath);

  return {
    pathname: resolvedPath(normalized),
    search: buildSearchParams(normalized.query) ?? '',
    hash: normalized.hash
      ? normalized.hash.startsWith('#')
        ? normalized.hash
        : `#${normalized.hash}`
      : '',
    state: normalized.state,
    replace: normalized.replace,
  };
}

export function normalizeRouterOptions(
  to: RouteLocationOptions,
  currentPath = '/',
): RouteLocationOptions {
  const normalized: RouteLocationOptions = {
    ...to,
  };

  if (!normalized.path && !normalized.name) {
    normalized.path = currentPath;
  }

  if (normalized.path && normalized.params) {
    normalized.params = undefined;
  }

  return normalized;
}

export function resolveRouteLocation(to: RouteLocationRaw, currentPath = '/'): Path {
  const resolved = buildResolvedTo(to, currentPath);
  return {
    pathname: resolved.pathname,
    search: resolved.search,
    hash: resolved.hash,
  };
}

export function resolvedPath({ name, path, params }: RouteLocationOptions): string {
  return name ? getPathByName(name, params) : buildPathWithParams(path!, params);
}

export function buildPathWithParams(path: string, params?: Params): string {
  if (!params || Object.keys(params).length === 0) {
    return path;
  }

  let finalPath = path;
  const paramMatches = path.match(/:\w+/g) || [];

  if (paramMatches.length > 0) {
    paramMatches.forEach((paramName) => {
      const key = paramName.slice(1);
      if (params[key] != null) {
        finalPath = finalPath.replace(paramName, encodeURIComponent(String(params[key])));
      }
    });
  }

  return finalPath;
}

export function buildSearchParams(query?: Record<string, any>): string | undefined {
  const encoded = stringifyQuery(query);
  return encoded ? `?${encoded}` : undefined;
}

export function findRouteByName(
  name: string,
  routes: RouteRecordRaw[] = _ROUTE_CONFIG_.source,
): RouteRecordRaw | null {
  for (const route of routes) {
    if (route.name === name) {
      return route;
    }
    if (route.children) {
      const found = findRouteByName(name, route.children);
      if (found) return found;
    }
  }
  return null;
}

function joinPaths(basePath: string, path?: string): string {
  if (!path) return basePath || '/';
  if (path.startsWith('/')) return path;
  if (!basePath || basePath === '/') return `/${path}`;
  return `${basePath}/${path}`;
}

function findRouteByNameWithBase(
  name: string,
  routes: RouteRecordRaw[],
  basePath = '',
): { route: RouteRecordRaw; fullPath: string } | null {
  for (const route of routes) {
    const fullPath = joinPaths(basePath, route.path);

    if (route.name === name) {
      return { route, fullPath };
    }

    if (route.children) {
      const found = findRouteByNameWithBase(name, route.children, fullPath);
      if (found) return found;
    }
  }

  return null;
}

export function hasRouteByName(name: string): boolean {
  return !!findRouteByName(name);
}

export function findParentRoute(parentName: string): RouteRecordRaw | null {
  return findRouteByName(parentName);
}

export function getPathByName(name?: string, params?: Params): string {
  if (!name) {
    throw new Error('[Router] Route name is required.');
  }

  const resolved = findRouteByNameWithBase(name, _ROUTE_CONFIG_.source);
  if (!resolved) {
    throw new Error(`[Router] Route with name "${name}" not found.`);
  }

  return buildPathWithParams(resolved.fullPath, params);
}

export function getRouteByPath(path: string): RouteRecordRaw | null {
  const findRouteByPath = (routes: RouteRecordRaw[], basePath = ''): RouteRecordRaw | null => {
    for (const route of routes) {
      if (route.path === path) {
        return route;
      }

      let fullPath = route.path;
      if (basePath && route.path) {
        if (basePath.endsWith('/') && route.path.startsWith('/')) {
          fullPath = basePath + route.path.slice(1);
        } else if (!basePath.endsWith('/') && !route.path.startsWith('/')) {
          fullPath = `${basePath}/${route.path}`;
        } else {
          fullPath = basePath + route.path;
        }
      } else if (basePath) {
        fullPath = basePath;
      }

      const match = matchPath(
        {
          path: fullPath!,
          caseSensitive: route.sensitive,
          end: false,
        },
        path,
      );

      if (match && match.pathname === path) {
        return route;
      }

      if (route.children) {
        const found = findRouteByPath(route.children, fullPath);
        if (found) return found;
      }
    }
    return null;
  };

  return findRouteByPath(_ROUTE_CONFIG_.source);
}

export function getRouteConfig(): Readonly<GlobalRouteConfig> {
  return Object.freeze(_ROUTE_CONFIG_);
}

export function isPromise(obj: any): obj is Promise<any> {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

/**
 * 判断是否为 React 组件函数
 */
export function isReactComponentType(component: any): component is FunctionComponent {
  // 排除已经是 React 元素的情况
  if (isValidElement(component)) {
    return false;
  }

  // 优先识别 React 内部标记（forwardRef/memo/lazy 等）
  // fix: 修复无法识别 memo / forwardRef / lazy 等对象形式的组件
  const $$typeof = component && (component.$$typeof as symbol | undefined);

  if ($$typeof) {
    const reactSymbols = [
      Symbol.for('react.forward_ref'),
      Symbol.for('react.memo'),
      Symbol.for('react.lazy'),
      Symbol.for('react.profiler'),
      Symbol.for('react.strict_mode'),
      Symbol.for('react.suspense'),
      Symbol.for('react.fragment'),
      Symbol.for('react.provider'),
      Symbol.for('react.consumer'),
      Symbol.for('react.context'),
    ];

    if (reactSymbols.includes($$typeof)) return true;
  }

  // 函数或类组件检测
  if (typeof component === 'function') {
    // class 组件检测（有 prototype.render 或 isReactComponent）
    if (
      component.prototype &&
      (component.prototype.isReactComponent || component.prototype.render)
    ) {
      return true;
    }

    // 函数组件通常采用 PascalCase 命名，使用首字母大写作为辅助判断
    const name = component.displayName || component.name || '';
    if (typeof name === 'string' && /^[A-Z]/.test(name)) {
      return true;
    }

    // 简单启发式：如果函数源码包含动态 import，通常是 loader（返回 Promise），因此不视为组件
    try {
      const src = Function.prototype.toString.call(component);
      if (/import\s*\(/.test(src)) {
        return false;
      }
    } catch (e) {
      // ignore
    }
  }

  return false;
}
