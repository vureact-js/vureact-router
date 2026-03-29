import { createContext, ReactNode, useContext } from 'react';
import type { Router } from '../creator/createRouter';
import type { GuardManagerImpl } from '../guards/guardManager';

interface RouterContextType {
  router: Router;
  guardManager: GuardManagerImpl;
}

const RouterContext = createContext<RouterContextType | null>(null);

interface RouterProviderProps {
  router: Router;
  guardManager: GuardManagerImpl;
  children: ReactNode;
}

export function RouterContextProvider({ router, guardManager, children }: RouterProviderProps) {
  return <RouterContext.Provider value={{ router, guardManager }}>{children}</RouterContext.Provider>;
}

export const useOptionalRouterContext = () => useContext(RouterContext);

export const useRouterContext = () => {
  const context = useOptionalRouterContext();
  if (!context) {
    throw new Error('useRouterContext must be used within a RouterContextProvider');
  }
  return context;
};
