import { createContext, ReactNode, useContext } from 'react';
import type { GuardManagerImpl } from '../guards/guardManager';

/**
 * 路由器上下文类型定义
 * 包含路由守卫管理器，用于管理路由切换时的权限检查和生命周期钩子
 */
interface RouterContextType {
  guardManager: GuardManagerImpl;
}

/**
 * 创建路由器上下文
 * 初始值为 null，用于检测组件是否在 RouterContextProvider 内部使用
 */
const RouterContext = createContext<RouterContextType | null>(null);

/**
 * RouterContextProvider 组件的属性接口
 */
interface RouterProviderProps {
  guardManager: GuardManagerImpl; // 路由守卫管理器实例
  children: ReactNode; // 子组件
}

/**
 * 路由器上下文提供者组件
 * 将 guardManager 注入到 React 上下文中，使所有子组件都能访问路由守卫功能
 *
 * @param guardManager - 路由守卫管理器实例
 * @param children - 子组件
 */
export function RouterContextProvider({ guardManager, children }: RouterProviderProps) {
  return <RouterContext.Provider value={{ guardManager }}>{children}</RouterContext.Provider>;
}

/**
 * 可选的路由器上下文 Hook
 * 获取路由器上下文，如果不在 RouterContextProvider 内部则返回 null
 * 适用于可选使用路由守卫功能的场景
 */
export const useOptionalRouterContext = () => useContext(RouterContext);

/**
 * 强制使用的路由器上下文 Hook
 * 获取路由器上下文，如果不在 RouterContextProvider 内部则抛出错误
 * 适用于必须使用路由守卫功能的场景
 *
 * @throws {Error} 当在 RouterContextProvider 外部使用时抛出错误
 */
export const useRouterContext = () => {
  const context = useOptionalRouterContext();
  if (!context) {
    throw new Error('useRouterContext must be used within a RouterContextProvider');
  }
  return context;
};
