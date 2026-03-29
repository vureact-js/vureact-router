import { type FC, type PropsWithChildren, type ReactNode } from 'react';
import type { DataRouter } from 'react-router-dom';
import { RouterProvider as ReactRouterProvider } from 'react-router-dom';
import type { Router } from './createRouter/types';
import { RouterContextProvider } from '../context/RouterContext';
import { GuardManagerImpl } from '../guards/guardManager';

type ReturnValues = {
  guardManager: GuardManagerImpl;
  RouterProvider: FC<{
    children?: ReactNode | undefined;
  }>;
};

export function createRouterProvider(routerCore: DataRouter, router: Router): ReturnValues {
  const guardManager = new GuardManagerImpl();
  const RouterProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
      <RouterContextProvider router={router} guardManager={guardManager}>
        <ReactRouterProvider router={routerCore} />
        {children}
      </RouterContextProvider>
    );
  };

  return { guardManager, RouterProvider };
}
