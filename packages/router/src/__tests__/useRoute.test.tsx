import { render } from '@testing-library/react';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { RouterView, createMemoryHistory, createRouter, type RouteLocation, useRoute } from '..';

describe('useRoute test suites', () => {
  let routeData: RouteLocation | null = null;
  const routerInstances: Array<{ clearAll: () => void }> = [];

  function TestComponent() {
    const route = useRoute();

    useEffect(() => {
      routeData = route;
    }, [route]);

    return <></>;
  }

  beforeEach(() => {
    routeData = null;
  });

  afterEach(() => {
    routerInstances.forEach((instance) => instance.clearAll());
    routerInstances.length = 0;
  });

  it('should return correct route information', () => {
    const instance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/user/:id',
          name: 'user',
          component: <TestComponent />,
        },
      ],
      initialEntries: ['/user/123?name=test#section'],
    });

    routerInstances.push(instance);
    render(<RouterProvider router={instance.router} />);

    expect(routeData).not.toBeNull();
    expect(routeData!.path).toBe('/user/123');
    expect(routeData!.name).toBe('user');
    expect(routeData!.params).toEqual({ id: '123' });
    expect(routeData!.query).toEqual({ name: 'test' });
    expect(routeData!.hash).toBe('#section');
    expect(routeData!.fullPath).toBe('/user/123?name=test#section');
  });

  it('should use custom parse/stringify query', () => {
    const instance = createRouter({
      history: createMemoryHistory(),
      stringifyQuery(query) {
        return Object.entries(query)
          .map(([k, v]) => `${k}:${v}`)
          .join(';');
      },
      parseQuery(search) {
        const raw = search.startsWith('?') ? search.slice(1) : search;
        if (!raw) return {};
        return Object.fromEntries(raw.split(';').map((entry) => entry.split(':')));
      },
      routes: [
        {
          path: '/search',
          component: <TestComponent />,
        },
      ],
      initialEntries: ['/search?foo:bar;page:2'],
    });

    routerInstances.push(instance);
    render(<RouterProvider router={instance.router} />);

    expect(routeData!.query).toEqual({ foo: 'bar', page: '2' });
  });

  it('should merge meta from matched records', () => {
    const instance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component: <RouterView />, 
          meta: { layout: 'main' },
          children: [
            {
              path: 'post/:id',
              component: <TestComponent />,
              meta: { requiresAuth: true },
            },
          ],
        },
      ],
      initialEntries: ['/post/1'],
    });

    routerInstances.push(instance);
    render(<instance.RouterProvider />);

    expect(routeData).not.toBeNull();
    expect(routeData!.meta).toEqual({ layout: 'main', requiresAuth: true });
    expect(routeData!.matched.length).toBeGreaterThan(1);
  });

  it('Redirection should return correct information.', () => {
    const instance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          redirect: () => ({
            path: '/post/:id',
            params: { id: '123' },
            query: { name: 'test' },
            state: { pwd: '123' },
          }),
        },
        {
          path: '/post/:id',
          component: <TestComponent />,
        },
      ],
    });

    routerInstances.push(instance);
    render(<RouterProvider router={instance.router} />);

    expect(routeData!.path).toBe('/post/123');
    expect(routeData!.params).toStrictEqual({ id: '123' });
    expect(routeData!.query).toStrictEqual({ name: 'test' });
    expect(routeData!.state).toStrictEqual({ pwd: '123' });
    expect(routeData!.fullPath).toBe('/post/123?name=test');
  });
});


