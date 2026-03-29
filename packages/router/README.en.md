<div align="center"><a name="readme-top"></a>

<img height="180" src="../../logo.png" />

# @vureact/router

Vue Router 4.x Adapter for React 18+ (Encapsulated on React Router DOM 7.9+)

[![npm version](https://img.shields.io/npm/v/@vureact/router.svg?style=flat-square)](https://router.vureact.top/)
[![npm downloads](https://img.shields.io/npm/dm/@vureact/router.svg?style=flat-square)](https://www.npmjs.com/package/@vureact/vureact-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React 18+](https://img.shields.io/badge/React-18%2B-61dafb)](https://reactjs.org/)

English | [简体中文](./README.md)

</div>

## ✨ Features

- **Vue Router API Compatibility**: Familiar API for Vue.js developers transitioning to React
- **Built on React Router DOM**: Leverages the stability and features of React Router DOM 7.9+
- **TypeScript First**: Full TypeScript support with comprehensive type definitions
- **Route Guards**: Support for `beforeEach`, `beforeResolve`, `afterEach` navigation guards
- **Async Components**: Built-in support for code splitting with lazy loading
- **Dynamic Routing**: Programmatic route addition and manipulation
- **Nested Routes**: Full support for nested route configurations
- **Route Meta Fields**: Attach metadata to routes for custom logic
- **Active Link Classes**: Automatic CSS class management for active links
- **Multiple History Modes**: Support for hash, browser, and memory history

## 📦 Installation

```bash
npm install @vureact/router
# or
yarn add @vureact/router
# or
pnpm add @vureact/router
```

### Peer Dependencies

- React >= 18.2.0
- React DOM >= 18.2.0
- React Router DOM >= 7.9.0

## 🚀 Quick Start

### Basic Setup

```tsx
import { createRoot } from 'react-dom/client';
import { createRouter, createWebHashHistory, RouterView, RouterLink } from '@vureact/router';

// Create router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: <div>Home Page</div>,
    },
    {
      path: '/about',
      component: <div>About Page</div>,
    },
    {
      path: '/users/:id',
      component: <div>User Profile</div>,
    },
  ],
});

// App component
function App() {
  return (
    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/users/123">User 123</RouterLink>
      </nav>
      <RouterView />
    </div>
  );
}

// Render your app
createRoot(document.getElementById('root')!).render(<router.RouterProvider />);
```

## 📖 API Reference

### Core Functions

#### `createRouter(options: RouterOptions): Router`

Creates a router instance with the given configuration.

```tsx
const router = createRouter({
  routes: [...],
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
});
```

#### `Router` Methods

- `router.beforeEach(guard: GuardWithNextFn)`: Register global before navigation guard
- `router.beforeResolve(guard: GuardWithNextFn)`: Register global before resolve guard
- `router.afterEach(guard: AfterEachGuard)`: Register global after navigation guard
- `router.onError(handler: ErrorHandler)`: Register global error handler
- `router.addRoute(route: RouteRecordRaw)`: Add a new route
- `router.addRoute(parentName: string, route: RouteRecordRaw)`: Add a nested route
- `router.hasRoute(name: string)`: Check if a route exists by name
- `router.resolve(to: RouteLocationRaw)`: Resolve a route location
- `router.getRoutes()`: Get all registered routes
- `router.clearAll()`: Clear all routes and guards

### Components

#### `RouterView`

The component that renders the matched route component.

```tsx
<RouterView customRender={(component, route) => <div> {component}</div>} />
```

#### `RouterLink`

A component for navigating between routes.

```tsx
<RouterLink
  to="/about"
  activeClassName="active-link"
  exactActiveClassName="exact-active-link"
  custom={({ href, isActive, navigate }) => (
    <button onClick={navigate} className={isActive ? 'active' : ''}>
      Go to About
    </button>
  )}
>
  About
</RouterLink>
```

### Hooks

#### `useRouter()`

Hook to access the router instance for programmatic navigation.

```tsx
import { useRouter } from '@vureact/router';

function MyComponent() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/about');
    // or
    router.push({ path: '/about', query: { tab: 'info' } });
  };

  return <button onClick={handleClick}>Go to About</button>;
}
```

#### `useRoute()`

Hook to access the current route information.

```tsx
import { useRoute } from '@vureact/router';

function MyComponent() {
  const route = useRoute();

  return (
    <div>
      <p>Current path: {route.path}</p>
      <p>Query params: {JSON.stringify(route.query)}</p>
      <p>Route params: {JSON.stringify(route.params)}</p>
      <p>Route meta: {JSON.stringify(route.meta)}</p>
    </div>
  );
}
```

#### Route Guards Hooks

- `useBeforeRouteEnter(guard: ComponentGuard)`: Component-level before enter guard
- `useBeforeRouteLeave(guard: ComponentGuard)`: Component-level before leave guard
- `useBeforeRouteUpdate(guard: ComponentGuard)`: Component-level before update guard

### Route Configuration

```tsx
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: '仪表板' },
      },
    ],
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: '/users/:id',
    component: UserProfile,
    beforeEnter: (to, from) => {
      // 组件特定守卫
      if (!isAuthenticated()) {
        return '/login';
      }
    },
  },
  {
    path: '/async',
    component: () => import('./AsyncComponent'),
    meta: {
      loadingComponent: <div>加载中...</div>,
    },
  },
  {
    path: '/redirect',
    redirect: '/home',
  },
  {
    path: '/custom-redirect',
    redirect: { path: '/target', query: { from: 'custom' } },
  },
];
```

## 🔒 Route Guards

### Global Guards

```tsx
const router = createRouter({ routes });

// Before each navigation
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login';
  }

  if (to.meta.guestOnly && isAuthenticated()) {
    return '/';
  }

  return true; // Continue navigation
});

// After each navigation
router.afterEach((to, from) => {
  // Analytics tracking
  trackPageView(to.fullPath);
});

// Error handling
router.onError((error) => {
  console.error('Navigation error:', error);
});
```

### Component Guards

```tsx
import { useBeforeRouteEnter, useBeforeRouteLeave } from '@vureact/router';

function UserProfile() {
  useBeforeRouteEnter((to, from) => {
    // Called before the component is mounted
    return fetchUserData(to.params.id);
  });

  useBeforeRouteLeave((to, from) => {
    // Called before leaving the component
    if (hasUnsavedChanges()) {
      return confirm('You have unsaved changes. Leave anyway?');
    }
    return true;
  });

  return <div>User Profile</div>;
}
```

## 🔄 Async Components & Code Splitting

```tsx
const routes = [
  {
    path: '/dashboard',
    component: () => import('./Dashboard'),
    meta: {
      loadingComponent: <div className="loading-spinner">Loading dashboard...</div>,
    },
  },
  {
    path: '/admin',
    component: lazy(() => import('./AdminPanel')),
  },
];
```

## 🎨 Active Link Styling

```css
/* Default classes */
.router-link-active {
  /* Applied when the link's route is active */
}

.router-link-exact-active {
  /* Applied when the link's route is exactly active */
}

/* Custom classes */
.active-link {
  color: blue;
  font-weight: bold;
}

.exact-active-link {
  color: red;
  border-bottom: 2px solid red;
}
```

```tsx
<RouterLink to="/about" activeClassName="active-link" exactActiveClassName="exact-active-link">
  About
</RouterLink>
```

## 📝 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  RouteRecordRaw,
  RouteLocation,
  RouteLocationOptions,
  RouterOptions,
  Router,
} from '@vureact/router';

// Type-safe route configuration
const routes: RouteRecordRaw[] = [
  {
    path: '/users/:id',
    name: 'user',
    component: <UserProfile />,
    meta: {
      requiresAuth: true,
      permissions: ['read'],
    },
  },
];

// Type-safe navigation
const router = useRouter();
router.push({ name: 'user', params: { id: '123' } });
```

## 🔧 Advanced Usage

### Dynamic Route Addition

```tsx
const router = createRouter({ routes: [] });

// Add routes dynamically
router.addRoute({
  path: '/dynamic',
  component: <DynamicPage />,
});

// Add nested route
router.addRoute('parent', {
  path: 'child',
  component: <ChildPage />,
});
```

### Custom Query Parsing

```tsx
const router = createRouter({
  routes,
  parseQuery: (search) => {
    // Custom query parsing logic
    return customParse(search);
  },
  stringifyQuery: (query) => {
    // Custom query stringification
    return customStringify(query);
  },
});
```

### Route Resolution

```tsx
const router = createRouter({ routes });

// Resolve a route location
const location = router.resolve('/users/123?tab=profile');
// or
const location = router.resolve({
  name: 'user',
  params: { id: '123' },
  query: { tab: 'profile' },
});

console.log(location.fullPath); // "/users/123?tab=profile"
console.log(location.params); // { id: '123' }
console.log(location.query); // { tab: 'profile' }
```

## 🤝 Migration from Vue Router

If you're familiar with Vue Router, you'll find @vureact/router very similar:

| Vue Router        | @vureact/router   | Notes               |
| ----------------- | ----------------- | ------------------- |
| `createRouter()`  | `createRouter()`  | Same API            |
| `<router-view>`   | `<RouterView>`    | PascalCase in React |
| `<router-link>`   | `<RouterLink>`    | PascalCase in React |
| `useRouter()`     | `useRouter()`     | Same API            |
| `useRoute()`      | `useRoute()`      | Same API            |
| Navigation Guards | Navigation Guards | Same guard types    |
| Route Meta        | Route Meta        | Same functionality  |
| Nested Routes     | Nested Routes     | Same configuration  |

## 🐛 Troubleshooting

### Common Issues

1. **"RouterProvider must be used within a Router context"**
   - Make sure you're wrapping your app with `<router.RouterProvider>`

2. **Routes not matching**
   - Check your route paths and ensure they're correctly nested
   - Use the `exact` prop on `RouterLink` for exact matching

3. **TypeScript errors**
   - Ensure you have the latest TypeScript version
   - Check your tsconfig.json for proper module resolution

## 📄 License

MIT © [Ryan John](./LICENSE)

## 🔗 Links

- [GitHub](https://github.com/vureact-js/vureact-router)
- [Documentation](https://router.vureact.top)
- [Issue Tracker](https://github.com/vureact-js/vureact-router/issues)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [VuReact](https://vureact.top/en)
