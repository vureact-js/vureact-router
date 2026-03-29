import type { RouteObject } from 'react-router-dom';
import type { RouteRecordRaw } from './createRouter/types';

export interface GlobalRouteConfig {
  /**
   * 原始路由配置
   */
  source: RouteRecordRaw[];
  /**
   * 转换后的 React Router 路由对象
   */
  converted: RouteObject[];
}

/**
 * 全局路由容器
 */
export const _ROUTE_CONFIG_ = createRouteContainer();

/**
 * 创建局部存储源路由和转换后路由的容器
 */
export function createRouteContainer(): GlobalRouteConfig {
  return {
    source: [],
    converted: [],
  };
}

export function registerRouteConfig(routes: RouteRecordRaw[], convertedRoutes: RouteObject[]) {
  _ROUTE_CONFIG_.source = routes;
  _ROUTE_CONFIG_.converted = convertedRoutes;
}

export function resetRouteConfig() {
  _ROUTE_CONFIG_.source = [];
  _ROUTE_CONFIG_.converted = [];
}
