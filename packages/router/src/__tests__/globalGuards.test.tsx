import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import { RouterView, createRouter, createWebHistory } from '..';

const createTestRouteOptions = () => ({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: <TestApp />,
      children: [
        { path: 'home', component: <Home /> },
        { path: 'about', component: <About /> },
        { path: 'contact', component: <Contact />, meta: { requiresCamera: true } },
        {
          path: 'profile/:id',
          component: <Profile />,
          meta: { requiresAuth: true },
        },
        { path: 'dashboard', component: <Dashboard />, meta: { requiresAuth: true } },
        { path: 'login', name: 'login', component: <Login /> },
      ],
    },
  ],
});

const TestApp = () => (
  <div data-testid="layout">
    <header>Header</header>
    <main>
      <RouterView />
    </main>
  </div>
);

const Home = () => <div>Home Page</div>;
const About = () => <div>About Page</div>;
const Contact = () => <div>Contact Page</div>;
const Profile = () => <div>Profile Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;
const Login = () => <div>Login Page</div>;

// ============== 鍩虹娴嬭瘯 ===============

describe('Global Navigation Guards Basic Test Suites', () => {
  // 姣忎釜娴嬭瘯鍓嶆竻鐞嗘墍鏈夌姸鎬?
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('beforeEach Guard', () => {
    it('should execute beforeEach on every navigation', async () => {
      const mockGuard = jest.fn((to, from, next) => next());
      const { RouterProvider, router, beforeEach } = createRouter(createTestRouteOptions());

      beforeEach(mockGuard);
      render(<RouterProvider />);

      // 瀵艰埅鍒板涓矾鐢?
      const navigations = ['/home', '/about', '/contact'];
      for (const path of navigations) {
        await act(async () => {
          router.navigate(path);
        });
      }

      expect(mockGuard).toHaveBeenCalledTimes(3);
    });

    it('should pass correct route objects to guards', async () => {
      const mockGuard = jest.fn((to, from, next) => next());
      const { RouterProvider, router, beforeEach } = createRouter(createTestRouteOptions());

      beforeEach(mockGuard);
      render(<RouterProvider />);

      await act(async () => {
        router.navigate('/profile/123?tab=info#section');
      });

      expect(mockGuard).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/profile/123',
          params: { id: '123' },
          query: { tab: 'info' },
          hash: '#section',
          meta: { requiresAuth: true },
        }),
        expect.objectContaining({ path: '/contact' }), // 杩欓噷涓?'/contact' 鏄洜涓轰笂涓€涓祴璇曟渶鍚庤繘鍏ョ殑椤甸潰
        expect.any(Function),
      );
    });
  });

  describe('afterEach Guard', () => {
    it('should execute afterEach after successful navigation', async () => {
      const mockAfterGuard = jest.fn();
      const { RouterProvider, router, afterEach } = createRouter(createTestRouteOptions());

      afterEach(mockAfterGuard);
      render(<RouterProvider />);

      await act(async () => {
        router.navigate('/home');
      });

      await waitFor(() => {
        expect(mockAfterGuard).toHaveBeenCalledWith(
          expect.objectContaining({ path: '/home' }),
          expect.objectContaining({ path: '/profile/123' }),
          undefined,
        );
      });
    });

    it('should not execute afterEach when navigation is blocked', async () => {
      const mockAfterGuard = jest.fn();
      const mockBeforeGuard = jest.fn((to, from, next) => next(false));

      const { RouterProvider, router, beforeEach, afterEach } =
        createRouter(createTestRouteOptions());

      beforeEach(mockBeforeGuard);
      afterEach(mockAfterGuard);
      render(<RouterProvider />);

      await act(async () => {
        router.navigate('/home');
      });

      expect(mockAfterGuard).not.toHaveBeenCalled();
    });
  });
});

// ================ 瀵艰埅璺敱瀹堝崼鎺у埗娴嬭瘯 ==================

describe('Global Navigation Guards Control Test Suites', () => {
  describe('beforeEach Guard', () => {
    // 姣忎釜娴嬭瘯鍓嶇瓑寰呭垵濮嬪鑸畬鎴?
    beforeEach(async () => {
      jest.clearAllMocks();
    });

    it('should intercept route navigation and redirect pages.', async () => {
      const mockGuard = jest.fn((to, from, next) => next());
      const { RouterProvider, router, beforeEach } = createRouter(createTestRouteOptions());

      // 鍒濆瀵艰埅
      beforeEach(mockGuard);
      render(<RouterProvider />);

      // 绛夊緟鍒濆瀵艰埅瀹屾垚
      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });

      // 鎷︽埅 dashboard 璺宠浆鑷?login
      beforeEach((to, from, next) => {
        if (to.path === '/dashboard') {
          next({ name: 'login' });
        } else {
          next();
        }
      });

      await act(async () => {
        router.navigate('/dashboard');
      });

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });

      // 灏濊瘯璁块棶 profile 闇€瑕佽璇佺殑椤甸潰
      let userRole = 'user';
      beforeEach((to, from, next) => {
        if (to.meta?.requiresAuth && userRole !== 'admin') {
          next('/login');
        } else {
          next();
        }
      });

      await act(async () => {
        router.navigate('/profile/123');
      });

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });

      // 鎻愬崌鏉冮檺鍚庡啀娆″皾璇?
      userRole = 'admin';
      await act(async () => {
        router.navigate('/profile/123');
      });

      await waitFor(() => {
        expect(screen.getByText('Profile Page')).toBeInTheDocument();
      });

      // 瀹堝崼骞跺彂鎵ц
      const guardExecutionOrder: string[] = [];

      beforeEach((to, from, next) => {
        guardExecutionOrder.push('first');
        next();
      });

      beforeEach((to, from, next) => {
        guardExecutionOrder.push('second');
        next();
      });

      beforeEach((to, from, next) => {
        guardExecutionOrder.push('third');
        next();
      });

      await act(async () => {
        router.navigate('/about');
      });

      await waitFor(() => {
        expect(screen.getByText('About Page')).toBeInTheDocument();
      });

      expect(guardExecutionOrder).toEqual(['first', 'second', 'third']);
    });
  });

  describe('afterEach Guard', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
    });

    it('should execute afterEach hooks in order after successful navigation', async () => {
      const { RouterProvider, router, afterEach } = createRouter(createTestRouteOptions());

      const executionOrder: string[] = [];

      // 娉ㄥ唽澶氫釜 afterEach 瀹堝崼
      afterEach(() => {
        executionOrder.push('first');
      });

      afterEach(() => {
        executionOrder.push('second');
      });

      afterEach(() => {
        executionOrder.push('third');
      });

      render(<RouterProvider />);

      // 涓婁竴涓祴璇曟渶鍚庤繘鍏ョ殑椤甸潰
      expect(screen.getByText('About Page')).toBeInTheDocument();

      // 鎵ц瀵艰埅
      await act(async () => {
        router.navigate('/contact');
      });

      // 楠岃瘉 afterEach 瀹堝崼鎸夐『搴忔墽琛?
      await waitFor(() => {
        expect(executionOrder).toEqual(['first', 'second', 'third']);
        expect(screen.getByText('Contact Page')).toBeInTheDocument();
      });
    });

    it('should receive correct route objects in afterEach guards', async () => {
      const { RouterProvider, router, afterEach } = createRouter(createTestRouteOptions());

      const mockAfterGuard = jest.fn();

      afterEach(mockAfterGuard);
      render(<RouterProvider />);

      // 涓婁竴涓祴璇曟渶鍚庤繘鍏ョ殑椤甸潰
      expect(screen.getByText('Contact Page')).toBeInTheDocument();

      // 瀵艰埅鍒板甫鍙傛暟鐨勮矾鐢?
      await act(async () => {
        router.navigate('/profile/456?view=details#main');
      });

      // 楠岃瘉 afterEach 鎺ユ敹鍒版纭殑璺敱瀵硅薄
      await waitFor(() => {
        expect(mockAfterGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            path: '/profile/456',
            params: { id: '456' },
            query: { view: 'details' },
            hash: '#main',
            meta: { requiresAuth: true },
          }),
          expect.objectContaining({ path: '/contact' }),
          undefined,
        );
      });
    });

    it('should not execute afterEach when navigation is blocked by beforeEach', async () => {
      const { RouterProvider, router, beforeEach, afterEach } =
        createRouter(createTestRouteOptions());

      const mockAfterGuard = jest.fn();
      const mockBeforeGuard = jest.fn((to, from, next) => {
        if (to.path === '/dashboard') {
          next(false); // 闃绘瀵艰埅
        } else {
          next();
        }
      });

      beforeEach(mockBeforeGuard);
      afterEach(mockAfterGuard);

      render(<RouterProvider />);

      // 涓婁竴涓祴璇曟渶鍚庤繘鍏ョ殑椤甸潰
      expect(screen.getByText('Profile Page')).toBeInTheDocument();

      // 灏濊瘯瀵艰埅鍒拌闃绘鐨勮矾鐢?
      await act(async () => {
        router.navigate('/dashboard');
      });

      // 楠岃瘉 afterEach 娌℃湁琚皟鐢?
      await waitFor(() => {
        expect(mockAfterGuard).toHaveBeenCalledWith(
          expect.objectContaining({ path: '/dashboard' }),
          expect.objectContaining({ path: '/profile/456' }),
          expect.objectContaining({ type: 'aborted' }),
        );
        // 椤甸潰搴旇浠嶇劧鏄剧ず Profile Page锛屽洜涓哄鑸闃绘
        expect(screen.getByText('Profile Page')).toBeInTheDocument();
      });
    });

    it('should execute afterEach even when beforeEach redirects', async () => {
      const { RouterProvider, router, beforeEach, afterEach } =
        createRouter(createTestRouteOptions());

      const mockAfterGuard = jest.fn();

      afterEach(mockAfterGuard);

      // 璁剧疆閲嶅畾鍚戝畧鍗?
      beforeEach((to, from, next) => {
        if (to.meta?.requiresAuth) {
          next('/login'); // 閲嶅畾鍚戝埌鐧诲綍椤?
        } else {
          next();
        }
      });

      render(<RouterProvider />);

      // 涓婁竴涓祴璇曟渶鍚庤繘鍏ョ殑椤甸潰
      expect(screen.getByText('Profile Page')).toBeInTheDocument();

      // 瀵艰埅鍒?dashboard锛屽簲璇ヨ閲嶅畾鍚戝埌 login
      await act(async () => {
        router.navigate('/dashboard');
      });

      // 楠岃瘉 afterEach 浠嶇劧琚墽琛岋紙鍥犱负閲嶅畾鍚戜篃鏄垚鍔熺殑瀵艰埅锛?
      await waitFor(() => {
        expect(mockAfterGuard).toHaveBeenCalled();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });
  });

  describe('beforResolve Guard', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
    });

    it('should be called once when navigating.', async () => {
      const { router, RouterProvider, beforeResolve } = createRouter(createTestRouteOptions());

      const mockGuard = jest.fn((to, from, next) => next());

      beforeResolve(mockGuard);

      render(<RouterProvider />);

      // 涓婁竴涓祴璇曟渶鍚庤繘鍏ョ殑椤甸潰
      expect(screen.getByText('Login Page')).toBeInTheDocument();

      await act(async () => {
        router.navigate('/home');
      });

      expect(mockGuard).toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });
    });
  });
});



