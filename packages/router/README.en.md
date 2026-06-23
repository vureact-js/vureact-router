# @vureact/router

**Use Vue Router 4.x-style routing APIs in React.**

`@vureact/router` is a **Vue Router-style router adaptation package** for React 18+.  
Built on top of React Router DOM 7.9+, it provides familiar capabilities such as `createRouter`, `RouterLink`, `RouterView`, `useRouter`, `useRoute`, navigation guards, and route meta.

[![Downloads](https://img.shields.io/npm/dt/@vureact/router?label=Downloads&style=flat-square)](https://www.npmjs.com/package/@vureact/router)
[![Coverage](https://codecov.io/gh/vureact-js/vureact-router/graph/badge.svg?flag=router&style=flat-square)](https://codecov.io/gh/vureact-js/vureact-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React >=18](https://img.shields.io/badge/React->=18-61dafb)](https://reactjs.org/)

English | [简体中文](./README.md)

## Who this package is for

- Teams migrating Vue Router-based apps to React
- React projects that want Vue Router-style APIs
- Projects using `@vureact/compiler-core` and needing router adaptation
- Teams more familiar with Vue Router’s mental model and organization

## Installation

```bash
npm install @vureact/router
```

You can also use:

```bash
pnpm add @vureact/router
yarn add @vureact/router
```

Peer dependencies:

- `react >= 18.2.0`
- `react-dom >= 18.2.0`
- `react-router-dom >= 7.9.0`

## Minimal example

```tsx
import { createRoot } from 'react-dom/client';
import {
  createRouter,
  createWebHashHistory,
  RouterLink,
  RouterView,
} from '@vureact/router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: <div>Home</div> },
    { path: '/about', component: <div>About</div> },
  ],
});

function App() {
  return (
    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      <RouterView />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<router.RouterProvider />);
```

## Most-used capabilities

### `createRouter`

```tsx
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: <HomePage /> },
    { path: '/about', name: 'about', component: <AboutPage /> },
  ],
});
```

### `RouterLink` and `RouterView`

```tsx
<RouterLink to="/about">About</RouterLink>
<RouterView />
```

### `useRouter`

```tsx
import { useRouter } from '@vureact/router';

function Toolbar() {
  const router = useRouter();
  return <button onClick={() => router.push('/about')}>Navigate</button>;
}
```

### `useRoute`

```tsx
import { useRoute } from '@vureact/router';

function DetailPage() {
  const route = useRoute();
  return <div>ID: {route.params.id}</div>;
}
```

### Navigation guards

```tsx
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login';
  }
  return true;
});
```

## Mapping from Vue Router

| Vue Router | @vureact/router |
| --- | --- |
| `createRouter()` | `createRouter()` |
| `<router-view>` | `<RouterView>` |
| `<router-link>` | `<RouterLink>` |
| `useRouter()` | `useRouter()` |
| `useRoute()` | `useRoute()` |
| navigation guards | navigation guards |
| route meta | route meta |

## What this package is not

- It is not a general state management library
- It is not a source-level port of Vue Router
- It is not the Vue-to-React compiler; for source transformation, use `@vureact/compiler-core`

## Documentation

- [Introduction](https://router.vureact.top/en/guide/introduction.html)
- [Navigation Guards](https://router.vureact.top/en/guide/guards.html)
- [API Docs](https://router.vureact.top/en/api/)

## Related projects

- [@vureact/compiler-core](https://vureact.top/en)
- [@vureact/runtime-core](https://runtime.vureact.top/en)

## Repository and license

- GitHub: <https://github.com/vureact-js/vureact-router>
- Docs: <https://router.vureact.top/en>

MIT © Ruihong Zhong (Ryan John)
