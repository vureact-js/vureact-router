import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { createMemoryHistory, createRouter, type RouteLocationOptions, useLink } from '..';

function LinkProbe({ to, replace = false }: { to: string | RouteLocationOptions; replace?: boolean }) {
  const link = useLink({ to, replace });

  return (
    <div>
      <div data-testid="href">{link.href}</div>
      <div data-testid="fullPath">{link.route.fullPath}</div>
      <div data-testid="active">{String(link.isActive)}</div>
      <div data-testid="exactActive">{String(link.isExactActive)}</div>
      <button onClick={link.navigate}>navigate</button>
    </div>
  );
}

describe('useLink', () => {
  it('should expose href and active states for current route', () => {
    const { router } = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/about', component: <LinkProbe to="/about" /> }],
      initialEntries: ['/about'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId('href')).toHaveTextContent('/about');
    expect(screen.getByTestId('fullPath')).toHaveTextContent('/about');
    expect(screen.getByTestId('active')).toHaveTextContent('true');
    expect(screen.getByTestId('exactActive')).toHaveTextContent('true');
  });

  it('should resolve object to and navigate with query/hash', async () => {
    const { router } = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/about',
          component: <LinkProbe to={{ path: '/search', query: { q: 'test', page: '1' }, hash: 'result' }} />,
        },
        {
          path: '/search',
          component: <div>Search Page</div>,
        },
      ],
      initialEntries: ['/about'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId('href')).toHaveTextContent('/search?q=test&page=1#result');
    expect(screen.getByTestId('active')).toHaveTextContent('false');

    fireEvent.click(screen.getByText('navigate'));

    await waitFor(() => {
      expect(screen.getByText('Search Page')).toBeInTheDocument();
    });

    expect(router.state.location.pathname).toBe('/search');
    expect(router.state.location.search).toBe('?q=test&page=1');
    expect(router.state.location.hash).toBe('#result');
  });

  it('should resolve named route with params', async () => {
    const { router } = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/about',
          component: <LinkProbe to={{ name: 'user', params: { id: '7' } }} />,
        },
        {
          path: '/user/:id',
          name: 'user',
          component: <div>User Page</div>,
        },
      ],
      initialEntries: ['/about'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId('href')).toHaveTextContent('/user/7');
    expect(screen.getByTestId('exactActive')).toHaveTextContent('false');

    fireEvent.click(screen.getByText('navigate'));

    await waitFor(() => {
      expect(screen.getByText('User Page')).toBeInTheDocument();
    });
  });
});
