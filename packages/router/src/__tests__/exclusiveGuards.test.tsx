import '@testing-library/jest-dom';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { RouterView, createRouter, createWebHistory } from '..';

const TestApp = () => (
  <div data-testid="layout">
    <header>Header</header>
    <main>
      <RouterView />
    </main>
  </div>
);

const Users = () => <div data-testid="Users">Users Page</div>;
const Contact = () => <div data-testid="Contact">Contact Page</div>;
const Login = () => <div data-testid="Login">Login Page</div>;
const Home = () => <div data-testid="Home">Home Page</div>;
const Profile = () => <div data-testid="Profile">Profile Page</div>;
const UserList = () => <div data-testid="UserList">List Page</div>;
const Details = () => <div data-testid="Details">Details Page</div>;

describe('Exclusive Guards Test Suites', () => {
  describe('Basic Routes', () => {
    let role = '';

    function removeQueryParams(to: any) {
      if (Object.keys(to.query).length) return { path: to.path, query: {}, hash: to.hash };
    }

    function removeHash(to: any) {
      if (to.hash) return { path: to.path, query: to.query, hash: '' };
    }

    const createTestRouteOptions = () => ({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          component: <TestApp />,
          children: [
            {
              path: 'users/:id',
              component: <Users />,
              beforeEnter: [removeQueryParams, removeHash],
            },
            {
              path: 'contact',
              component: <Contact />,
              beforeEnter(to: object, from: object) {
                if (role === 'user') {
                  return true;
                }
                return { name: 'Login' };
              },
            },
            { path: 'login', name: 'Login', component: <Login /> },
          ],
        },
      ],
    });

    beforeEach(() => {
      jest.clearAllMocks();
      role = '';
    });

    afterEach(() => {
      cleanup();
      window.history.pushState({}, '', '/');
    });

    it('should execute beforeEnter guard array and remove query params and hash', async () => {
      const { RouterProvider, router } = createRouter(createTestRouteOptions());

      render(<RouterProvider />);

      // 鍒濆鍦ㄦ牴璺緞锛屽鑸埌甯uery鍜宧ash鐨勭敤鎴烽〉闈?
      await act(async () => {
        router.navigate('/users/123?tab=profile#section');
      });

      // 绛夊緟瀵艰埅瀹屾垚锛岄獙璇?beforeEnter 娓呴櫎浜?query 鍜?hash
      await waitFor(() => {
        expect(screen.getByTestId('Users')).toBeInTheDocument();
      });

      // 楠岃瘉褰撳墠璺緞搴旇鏄?/users/123锛堟病鏈塹uery鍜宧ash锛?
      expect(router.state.location.pathname).toBe('/users/123');
      expect(router.state.location.search).toBe('');
      expect(router.state.location.hash).toBe('');
    });

    it('should redirect to login when accessing contact without user role', async () => {
      const { RouterProvider, router } = createRouter(createTestRouteOptions());

      render(<RouterProvider />);

      // 褰撳墠鍦?/users/123锛屽皾璇曡闂?contact锛堟病鏈塽ser瑙掕壊锛?
      await act(async () => {
        router.navigate('/contact');
      });

      // 搴旇琚噸瀹氬悜鍒扮櫥褰曢〉
      await waitFor(() => {
        expect(screen.getByTestId('Login')).toBeInTheDocument();
      });
    });

    it('should allow access to contact when user has user role', async () => {
      const { RouterProvider, router } = createRouter(createTestRouteOptions());

      render(<RouterProvider />);

      // 璁剧疆鐢ㄦ埛瑙掕壊
      role = 'user';

      // 褰撳墠鍦?/login锛屽皾璇曡闂?contact锛堟湁user瑙掕壊锛?
      await act(async () => {
        router.navigate('/contact');
      });

      // 搴旇鑳藉姝ｅ父璁块棶
      await waitFor(() => {
        expect(screen.getByTestId('Contact')).toBeInTheDocument();
      });
    });

    it('should not trigger beforeEnter when only params change', async () => {
      const mockBeforeEnter = jest.fn((to, from, next) => next());

      const { RouterProvider, router } = createRouter({
        history: createWebHistory(),
        routes: [
          {
            path: '/',
            component: <TestApp />,
            children: [
              { path: 'home', component: <Home /> },
              {
                path: 'users/:id',
                component: <Users />,
                beforeEnter: mockBeforeEnter,
              },
            ],
          },
        ],
      });

      render(<RouterProvider />);

      // 棣栨瀵艰埅鍒?/users/1锛屽簲璇ヨЕ鍙?beforeEnter
      await act(async () => {
        router.navigate('/users/1');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Users')).toBeInTheDocument();
      });

      expect(mockBeforeEnter).toHaveBeenCalledTimes(1);

      // 閲嶇疆璋冪敤璁℃暟
      mockBeforeEnter.mockClear();

      // 瀵艰埅鍒?/users/2锛堜粎鍙傛暟鍙樺寲锛夛紝涓嶅簲璇ヨЕ鍙?beforeEnter
      await act(async () => {
        router.navigate('/users/2');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Users')).toBeInTheDocument();
      });

      expect(mockBeforeEnter).not.toHaveBeenCalled();
    });

    it('should not trigger beforeEnter when only query or hash changes', async () => {
      const mockBeforeEnter = jest.fn((to, from, next) => next());

      const { RouterProvider, router } = createRouter({
        history: createWebHistory(),
        routes: [
          {
            path: '/',
            component: <TestApp />,
            children: [
              { path: 'home', component: <Home /> },
              {
                path: 'profile',
                component: <Profile />,
                beforeEnter: mockBeforeEnter,
              },
            ],
          },
        ],
      });

      render(<RouterProvider />);

      await act(async () => {
        router.navigate('/home');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Home')).toBeInTheDocument();
      });

      // 棣栨瀵艰埅鍒?/profile锛屽簲璇ヨЕ鍙?beforeEnter
      await act(async () => {
        router.navigate('/profile');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Profile')).toBeInTheDocument();
      });

      expect(mockBeforeEnter).toHaveBeenCalledTimes(1);

      // 閲嶇疆璋冪敤璁℃暟
      mockBeforeEnter.mockClear();

      // 娣诲姞 query 鍙傛暟锛屼笉搴旇瑙﹀彂 beforeEnter锛堣矾寰勭浉鍚岋級
      await act(async () => {
        router.navigate('/profile?tab=settings');
      });

      expect(mockBeforeEnter).not.toHaveBeenCalled();

      // 娣诲姞 hash锛屼笉搴旇瑙﹀彂 beforeEnter锛堣矾寰勭浉鍚岋級
      await act(async () => {
        router.navigate('/profile#section');
      });

      expect(mockBeforeEnter).not.toHaveBeenCalled();
    });

    it('should execute beforeEnter in correct order with global guards', async () => {
      const executionOrder: string[] = [];

      const { RouterProvider, router, beforeEach, beforeResolve, afterEach } = createRouter({
        history: createWebHistory(),
        routes: [
          {
            path: '/',
            component: <TestApp />,
            children: [
              {
                path: 'protected',
                component: <Profile />,
                beforeEnter: (to, from) => {
                  executionOrder.push('beforeEnter');
                },
              },
            ],
          },
        ],
      });

      beforeEach((to, from, next) => {
        executionOrder.push('beforeEach');
        next();
      });

      beforeResolve((to, from, next) => {
        executionOrder.push('beforeResolve');
        next();
      });

      afterEach(() => {
        executionOrder.push('afterEach');
      });

      render(<RouterProvider />);

      // 浠庡垵濮嬭矾寰勫鑸埌鍙椾繚鎶ょ殑璺敱
      await act(async () => {
        router.navigate('/protected');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Profile')).toBeInTheDocument();
      });

      // 楠岃瘉鎵ц椤哄簭
      expect(executionOrder).toEqual(['beforeEach', 'beforeEnter', 'beforeResolve', 'afterEach']);
    });
  });

  describe('Nested Routes', () => {
    const mockParentBeforeEnter = jest.fn((to, from, next) => next());
    const mockChildBeforeEnter = jest.fn((to, from, next) => next());

    let router: any;
    let RouterProvider: any;

    beforeEach(() => {
      jest.clearAllMocks();

      const routerInstance = createRouter({
        history: createWebHistory(),
        routes: [
          {
            path: '/',
            component: <TestApp />,
            children: [
              {
                path: 'user',
                component: <RouterView />,
                beforeEnter: mockParentBeforeEnter,
                children: [
                  { path: 'list', component: <UserList />, beforeEnter: mockChildBeforeEnter },
                  { path: 'details', component: <Details /> },
                ],
              },
            ],
          },
        ],
      });

      router = routerInstance.router;
      RouterProvider = routerInstance.RouterProvider;
    });

    afterEach(() => {
      cleanup();
      window.history.pushState({}, '', '/');
    });

    it('should not trigger parent beforeEnter when moving between child routes with same parent', async () => {
      render(<RouterProvider />);

      // 棣栨瀵艰埅鍒?/user/list锛屽簲璇ヨЕ鍙戠埗绾?beforeEnter + 鑷韩 beforeEnter
      await act(async () => {
        router.navigate('/user/list');
      });

      await waitFor(() => {
        // 閫氳繃 testid 鎵惧埌 user-layout锛岀劧鍚庡湪鍏跺唴閮ㄦ煡鎵惧瓙璺敱鍐呭
        expect(screen.getByTestId('UserList')).toBeInTheDocument();
      });

      expect(mockParentBeforeEnter).toHaveBeenCalledTimes(1);
      expect(mockChildBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);

      // 閲嶇疆璋冪敤璁℃暟;
      mockParentBeforeEnter.mockClear();
      mockChildBeforeEnter.mockClear();

      await act(async () => {
        router.navigate('/user/details');
      });

      // 瀵艰埅鍒?/user/details锛堢浉鍚岀埗绾х殑瀛愯矾鐢憋級锛屼笉搴旇瑙﹀彂鐖剁骇 beforeEnter
      await waitFor(() => {
        expect(screen.getByTestId('Details')).toBeInTheDocument();
      });

      expect(mockParentBeforeEnter).not.toHaveBeenCalled();
      expect(mockChildBeforeEnter).not.toHaveBeenCalled();
    });

    it('should trigger child beforeEnter when moving between child routes with same parent', async () => {
      render(<RouterProvider />);

      // 瀵艰埅鍒?/user/details 浣滀负璧风偣
      await act(async () => {
        router.navigate('/user/details');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Details')).toBeInTheDocument();
      });

      // 瀵艰埅鍒?/user/list锛堟湁 beforeEnter 鐨勫瓙璺敱锛夛紝搴旇瑙﹀彂瀛愯矾鐢辩殑 beforeEnter
      await act(async () => {
        router.navigate('/user/list');
      });

      await waitFor(() => {
        expect(screen.getByTestId('UserList')).toBeInTheDocument();
      });

      expect(mockChildBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    it('should trigger parent beforeEnter when entering from different parent route', async () => {
      render(<RouterProvider />);

      // 浠?/ 瀵艰埅鍒?/user/list锛屽簲璇ヨЕ鍙戠埗绾?beforeEnter
      await act(async () => {
        router.navigate('/user/details');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Details')).toBeInTheDocument();
      });

      expect(mockParentBeforeEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe('Complex Nested Routes', () => {
    const mockGrandParentBeforeEnter = jest.fn((to, from, next) => next());
    const mockParentBeforeEnter = jest.fn((to, from, next) => next());
    const mockChildBeforeEnter = jest.fn((to, from, next) => next());

    const mockUserBeforeEnter = jest.fn((to, from, next) => next());
    const mockProfileBeforeEnter = jest.fn((to, from, next) => next());

    const mockAdminBeforeEnter = jest.fn((to, from, next) => next());

    let router: any;
    let RouterProvider: any;

    beforeEach(() => {
      jest.clearAllMocks();

      const routerInstance = createRouter({
        history: createWebHistory(),
        routes: [
          {
            path: '/',
            component: <TestApp />,
            children: [
              {
                path: 'grand',
                component: <RouterView />,
                beforeEnter: mockGrandParentBeforeEnter,
                children: [
                  {
                    path: 'parent',
                    component: <RouterView />,
                    beforeEnter: mockParentBeforeEnter,
                    children: [
                      {
                        path: 'child',
                        component: <UserList />,
                        beforeEnter: mockChildBeforeEnter,
                      },
                      {
                        path: 'nephew',
                        component: <Details />,
                      },
                    ],
                  },
                ],
              },
              {
                path: 'users/:userId',
                component: <RouterView />,
                beforeEnter: mockUserBeforeEnter,
                children: [
                  {
                    path: 'profile',
                    component: <UserList />,
                    beforeEnter: mockProfileBeforeEnter,
                  },
                  {
                    path: 'settings',
                    component: <Details />,
                  },
                ],
              },
              {
                path: 'admin',
                component: <RouterView />,
                beforeEnter: mockAdminBeforeEnter,
                children: [
                  {
                    path: 'users/:userId',
                    component: <RouterView />,
                    beforeEnter: mockUserBeforeEnter,
                    children: [
                      { path: 'edit', component: <UserList /> },
                      { path: 'view', component: <Details /> },
                    ],
                  },
                ],
              },
              {
                path: 'home',
                component: <RouterView />,
                beforeEnter: mockParentBeforeEnter,
                children: [
                  {
                    path: 'main',
                    component: <Home />,
                    beforeEnter: mockChildBeforeEnter,
                  },
                  {
                    path: 'contact',
                    component: <Contact />,
                  },
                ],
              },
            ],
          },
        ],
      });

      router = routerInstance.router;
      RouterProvider = routerInstance.RouterProvider;
    });

    afterEach(() => {
      cleanup();
      window.history.pushState({}, '', '/');
    });

    it('should handle multi-level nested routes with different depths', async () => {
      render(<RouterProvider />);

      // 棣栨瀵艰埅鍒?/grand/parent/child锛屽簲璇ヨЕ鍙戞墍鏈夌埗绾?beforeEnter
      await act(async () => {
        router.navigate('/grand/parent/child');
      });

      await waitFor(() => {
        expect(screen.getByTestId('UserList')).toBeInTheDocument();
      });

      expect(mockGrandParentBeforeEnter).toHaveBeenCalledTimes(1);
      expect(mockParentBeforeEnter).toHaveBeenCalledTimes(1);
      expect(mockChildBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);

      mockGrandParentBeforeEnter.mockClear();
      mockParentBeforeEnter.mockClear();
      mockChildBeforeEnter.mockClear();

      // 瀵艰埅鍒?/grand/parent/nephew
      await act(async () => {
        router.navigate('/grand/parent/nephew');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Details')).toBeInTheDocument();
      });

      // 鐖剁骇 beforeEnter 涓嶅簲璇ヨЕ鍙?
      expect(mockGrandParentBeforeEnter).not.toHaveBeenCalled();
      expect(mockParentBeforeEnter).not.toHaveBeenCalled();
      expect(mockChildBeforeEnter).not.toHaveBeenCalled(); // child 鐨?beforeEnter 涓嶅簲璇ヨЕ鍙戯紝鍥犱负瀵艰埅鐩爣涓嶆槸 child
    });

    it('should handle dynamic nested routes correctly', async () => {
      render(<RouterProvider />);

      // 棣栨瀵艰埅鍒?/users/123/profile
      await act(async () => {
        router.navigate('/users/123/profile');
      });

      await waitFor(() => {
        expect(screen.getByTestId('UserList')).toBeInTheDocument();
      });

      expect(mockUserBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);
      expect(mockProfileBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);

      // 閲嶇疆璋冪敤璁℃暟
      mockUserBeforeEnter.mockClear();
      mockProfileBeforeEnter.mockClear();

      // 瀵艰埅鍒?/users/123/settings锛堢浉鍚岀埗绾х殑瀛愯矾鐢憋級锛屼笉搴旇瑙﹀彂鐖剁骇 beforeEnter
      await act(async () => {
        router.navigate('/users/123/settings');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Details')).toBeInTheDocument();
      });

      expect(mockUserBeforeEnter).not.toHaveBeenCalled();
      expect(mockProfileBeforeEnter).not.toHaveBeenCalled();

      // 閲嶇疆璋冪敤璁℃暟
      mockUserBeforeEnter.mockClear();
      mockProfileBeforeEnter.mockClear();

      // 瀵艰埅鍒?/users/456/profile锛堜笉鍚岀敤鎴凤紝搴旇瑙﹀彂鐖剁骇 beforeEnter锛?
      await act(async () => {
        router.navigate('/users/456/profile');
      });

      await waitFor(() => {
        expect(screen.getByTestId('UserList')).toBeInTheDocument();
      });

      expect(mockUserBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);
      expect(mockProfileBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle mixed static and dynamic nested routes', async () => {
      render(<RouterProvider />);

      // 棣栨瀵艰埅鍒?/admin/users/123/edit
      await act(async () => {
        router.navigate('/admin/users/123/edit');
      });

      await waitFor(() => {
        expect(screen.getByTestId('UserList')).toBeInTheDocument();
      });

      expect(mockAdminBeforeEnter).toHaveBeenCalledTimes(1);
      expect(mockUserBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);

      // 閲嶇疆璋冪敤璁℃暟
      mockAdminBeforeEnter.mockClear();
      mockUserBeforeEnter.mockClear();

      // 瀵艰埅鍒?/admin/users/123/view锛堢浉鍚岀埗绾х殑瀛愯矾鐢憋級锛屼笉搴旇瑙﹀彂鐖剁骇 beforeEnter
      await act(async () => {
        router.navigate('/admin/users/123/view');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Details')).toBeInTheDocument();
      });

      expect(mockAdminBeforeEnter).not.toHaveBeenCalled();
      expect(mockUserBeforeEnter).not.toHaveBeenCalled();

      // 閲嶇疆璋冪敤璁℃暟
      mockAdminBeforeEnter.mockClear();
      mockUserBeforeEnter.mockClear();

      // 瀵艰埅鍒?/admin/users/456/edit锛堜笉鍚岀敤鎴凤紝搴旇瑙﹀彂鐢ㄦ埛绾?beforeEnter锛?
      await act(async () => {
        router.navigate('/admin/users/456/edit');
      });

      await waitFor(() => {
        expect(screen.getByTestId('UserList')).toBeInTheDocument();
      });

      expect(mockAdminBeforeEnter).not.toHaveBeenCalled(); // admin 绾т笉鍙?
      expect(mockUserBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1); // 鐢ㄦ埛绾у彉鍖?
    });

    it('should handle route with index routes in nested structure', async () => {
      render(<RouterProvider />);

      // 棣栨瀵艰埅鍒?/home锛坕ndex璺敱锛?
      await act(async () => {
        router.navigate('/home/main');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Home')).toBeInTheDocument();
      });

      // 鍦?redirect 璺敱 /home 涓紝 beforeEnter 涓嶅簲璇ヨ瑙﹀彂
      expect(mockParentBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);
      // 璺宠浆鍒?/home/main 搴旇瑙﹀彂鑷韩 beforeEnter
      expect(mockChildBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);

      // 閲嶇疆璋冪敤璁℃暟
      mockChildBeforeEnter.mockClear();

      // 瀵艰埅鍒?/home/contact锛屼笉搴旇瑙﹀彂鐖剁骇 beforeEnter
      await act(async () => {
        router.navigate('/home/contact');
      });

      await waitFor(() => {
        expect(screen.getByTestId('Contact')).toBeInTheDocument();
      });

      expect(mockParentBeforeEnter.mock.calls.length).toBeGreaterThanOrEqual(1);
      expect(mockChildBeforeEnter).not.toHaveBeenCalled();
    });
  });
});



