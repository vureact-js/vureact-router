import { act, renderHook } from '@testing-library/react';
import { createMemoryHistory, createRouter, useRouter, type Router } from '..';

function TestComponent({ onRouter }: { onRouter: (router: Router) => void }) {
  const router = useRouter();
  onRouter(router);
  return <></>;
}

describe('useRouter test suites', () => {
  let routerInstance: Router;
  let testRouter: Router | null = null;

  beforeEach(() => {
    testRouter = null;
    routerInstance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component: (
            <TestComponent
              onRouter={(router) => {
                testRouter = router;
              }}
            />
          ),
        },
        { path: '/about', name: 'about', component: <div>About Page</div> },
        { path: '/user/:id', component: <div>User Page</div> },
        { path: '/search', component: <div>Search Page</div> },
        { path: '/docs', component: <div>Docs Page</div> },
        { path: '/home', component: <div>Home Page</div> },
      ],
    });
  });

  it('should provide router methods', () => {
    renderHook(() => useRouter(), { wrapper: routerInstance.RouterProvider });

    expect(testRouter).toBeDefined();
    expect(typeof testRouter!.push).toBe('function');
    expect(typeof testRouter!.replace).toBe('function');
    expect(typeof testRouter!.back).toBe('function');
    expect(typeof testRouter!.forward).toBe('function');
    expect(typeof testRouter!.go).toBe('function');
  });

  it('should push with query parameters', () => {
    renderHook(() => useRouter(), { wrapper: routerInstance.RouterProvider });

    act(() => {
      testRouter!.push({ path: '/search', query: { q: 'book', page: '1' } });
    });

    expect(routerInstance.router.state.location.pathname).toBe('/search');
    expect(routerInstance.router.state.location.search).toBe('?q=book&page=1');
  });

  it('should push to new route with state by name', () => {
    renderHook(() => useRouter(), { wrapper: routerInstance.RouterProvider });

    act(() => {
      testRouter!.push({ name: 'about', state: { pwd: '123' } });
    });

    expect(routerInstance.router.state.location.pathname).toBe('/about');
    expect(routerInstance.router.state.location.state).toStrictEqual({ pwd: '123' });
  });

  it('should push with hash', () => {
    renderHook(() => useRouter(), { wrapper: routerInstance.RouterProvider });

    act(() => {
      testRouter!.push({ path: '/docs', hash: 'installation' });
    });

    expect(routerInstance.router.state.location.pathname).toBe('/docs');
    expect(routerInstance.router.state.location.hash).toBe('#installation');
  });

  it('should replace current route', () => {
    renderHook(() => useRouter(), { wrapper: routerInstance.RouterProvider });

    act(() => {
      testRouter!.replace('/about');
    });

    expect(routerInstance.router.state.location.pathname).toBe('/about');
  });

  it('should go back and forward', () => {
    renderHook(() => useRouter(), { wrapper: routerInstance.RouterProvider });

    act(() => {
      testRouter!.push('/about');
    });
    expect(routerInstance.router.state.location.pathname).toBe('/about');

    act(() => {
      testRouter!.push('/search');
    });
    expect(routerInstance.router.state.location.pathname).toBe('/search');

    act(() => {
      testRouter!.back();
    });
    expect(routerInstance.router.state.location.pathname).toBe('/about');

    act(() => {
      testRouter!.forward();
    });
    expect(routerInstance.router.state.location.pathname).toBe('/search');
  });

  it('should not mutate to options object', () => {
    renderHook(() => useRouter(), { wrapper: routerInstance.RouterProvider });

    const to = { path: '/user/:id', params: { id: '1' }, query: { tab: 'x' } } as const;

    act(() => {
      testRouter!.push(to as any);
    });

    expect(to).toEqual({ path: '/user/:id', params: { id: '1' }, query: { tab: 'x' } });
  });

  it('should expose resolve result', () => {
    renderHook(() => useRouter(), { wrapper: routerInstance.RouterProvider });

    const resolved = testRouter!.resolve({ name: 'about', query: { tab: 'profile' }, hash: 'info' });

    expect(resolved.path).toBe('/about');
    expect(resolved.fullPath).toBe('/about?tab=profile#info');
    expect(resolved.query).toEqual({ tab: 'profile' });
    expect(resolved.hash).toBe('#info');
  });

  it('should return current path', () => {
    routerInstance = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', redirect: '/home?tab=settings#profile' },
        {
          path: '/home',
          component: (
            <TestComponent
              onRouter={(router) => {
                testRouter = router;
              }}
            />
          ),
        },
      ],
    });

    renderHook(() => useRouter(), { wrapper: routerInstance.RouterProvider });
    expect(testRouter!.current).toBe('/home?tab=settings#profile');
  });
});
