import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import {
  RouterView,
  createMemoryHistory,
  createRouter,
  isNavigationFailure,
  useRoute,
} from '..';

describe('router API extensions', () => {
  it('should support addRoute/hasRoute/resolve', async () => {
    const routerInstance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'root',
          component: <RouterView />,
          children: [{ path: 'home', name: 'home', component: <div>Home</div> }],
        },
      ],
      initialEntries: ['/home'],
    });

    render(<routerInstance.RouterProvider />);

    expect(routerInstance.hasRoute('home')).toBe(true);
    expect(routerInstance.hasRoute('missing')).toBe(false);

    routerInstance.addRoute({ path: '/extra', name: 'extra', component: <div>Extra</div> });
    expect(routerInstance.hasRoute('extra')).toBe(true);

    await act(async () => {
      await routerInstance.router.navigate('/extra');
    });

    await waitFor(() => {
      expect(screen.getByText('Extra')).toBeInTheDocument();
    });

    routerInstance.addRoute('root', { path: 'child', name: 'child', component: <div>Child</div> });

    await act(async () => {
      await routerInstance.router.navigate('/child');
    });

    await waitFor(() => {
      expect(screen.getByText('Child')).toBeInTheDocument();
    });

    const resolved = routerInstance.resolve({ name: 'home', query: { q: 'x' }, hash: 'part' });
    expect(resolved.path).toBe('/home');
    expect(resolved.fullPath).toBe('/home?q=x#part');
    expect(resolved.query).toEqual({ q: 'x' });
  });

  it('should support unregister callbacks and onError', async () => {
    const beforeEach = jest.fn((to, from, next) => next());
    const beforeResolve = jest.fn((to, from, next) => next());
    const afterEach = jest.fn();
    const onError = jest.fn();

    const routerInstance = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          component: <RouterView />,
          children: [
            { path: 'home', component: <div>Home</div> },
            { path: 'boom', component: <div>Boom</div>, beforeEnter: () => { throw new Error('guard boom'); } },
          ],
        },
      ],
      initialEntries: ['/home'],
    });

    const offBeforeEach = routerInstance.beforeEach(beforeEach);
    const offBeforeResolve = routerInstance.beforeResolve(beforeResolve);
    const offAfterEach = routerInstance.afterEach(afterEach);
    const offError = routerInstance.onError(onError);

    render(<routerInstance.RouterProvider />);

    await act(async () => {
      await routerInstance.router.navigate('/boom');
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(afterEach).toHaveBeenCalledWith(
        expect.objectContaining({ path: '/boom' }),
        expect.any(Object),
        expect.objectContaining({ type: 'error' }),
      );

      const failure = afterEach.mock.calls.at(-1)?.[2];
      expect(isNavigationFailure(failure)).toBe(true);
    });

    offBeforeEach();
    offBeforeResolve();
    offAfterEach();
    offError();

    beforeEach.mockClear();
    beforeResolve.mockClear();
    afterEach.mockClear();
    onError.mockClear();

    await act(async () => {
      await routerInstance.router.navigate('/home');
    });

    expect(beforeEach).not.toHaveBeenCalled();
    expect(beforeResolve).not.toHaveBeenCalled();
    expect(afterEach).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});

