import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import { RouterView, createMemoryHistory, createRouter, useBeforeRouteEnter } from '..';

describe('useBeforeRouteEnter (experimental)', () => {
  it('should run enter guard on component mount with to/from', async () => {
    const enterMock = jest.fn();

    const EnterComp = () => {
      useBeforeRouteEnter((to, from) => {
        enterMock(to.path, from.path);
      });
      return <div>Enter Page</div>;
    };

    const routerInstance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component: <RouterView />,
          children: [
            { path: 'home', component: <div>Home</div> },
            { path: 'enter', component: <EnterComp /> },
          ],
        },
      ],
      initialEntries: ['/home'],
    });

    render(<routerInstance.RouterProvider />);

    await act(async () => {
      await routerInstance.router.navigate('/enter');
    });

    await waitFor(() => {
      expect(screen.getByText('Enter Page')).toBeInTheDocument();
      expect(enterMock).toHaveBeenCalledWith('/enter', '/home');
    });
  });


  it('should support object navigation return', async () => {
    const EnterComp = () => {
      useBeforeRouteEnter(() => ({ path: '/target', query: { q: '1' } } as any));
      return <div>Enter Page</div>;
    };

    const routerInstance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component: <RouterView />,
          children: [
            { path: 'home', component: <div>Home</div> },
            { path: 'enter', component: <EnterComp /> },
            { path: 'target', component: <div>Target Query</div> },
          ],
        },
      ],
      initialEntries: ['/home'],
    });

    render(<routerInstance.RouterProvider />);

    await act(async () => {
      await routerInstance.router.navigate('/enter');
    });

    await waitFor(() => {
      expect(screen.getByText('Target Query')).toBeInTheDocument();
      expect(routerInstance.router.state.location.search).toBe('?q=1');
    });
  });

  it('should support false return and stay on previous route', async () => {
    const EnterComp = () => {
      useBeforeRouteEnter(() => false);
      return <div>Enter Blocked</div>;
    };

    const routerInstance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component: <RouterView />,
          children: [
            { path: 'home', component: <div>Home</div> },
            { path: 'enter', component: <EnterComp /> },
          ],
        },
      ],
      initialEntries: ['/home'],
    });

    render(<routerInstance.RouterProvider />);

    await act(async () => {
      await routerInstance.router.navigate('/enter');
    });

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });
  it('should support redirect return value', async () => {
    const EnterComp = () => {
      useBeforeRouteEnter(() => '/target');
      return <div>Enter Page</div>;
    };

    const routerInstance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component: <RouterView />,
          children: [
            { path: 'home', component: <div>Home</div> },
            { path: 'enter', component: <EnterComp /> },
            { path: 'target', component: <div>Target Page</div> },
          ],
        },
      ],
      initialEntries: ['/home'],
    });

    render(<routerInstance.RouterProvider />);

    await act(async () => {
      await routerInstance.router.navigate('/enter');
    });

    await waitFor(() => {
      expect(screen.getByText('Target Page')).toBeInTheDocument();
    });
  });
});

