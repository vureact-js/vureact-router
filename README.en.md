<div align="center"><a name="readme-top"></a>

<img height="180" src="./logo.png" />

# @vureact/router

**Bring Vue Router 4.x ergonomics to React.**

> A Vue Router-style router adapter for React.  
>
> Built on top of React Router DOM 7.9+, it provides familiar capabilities such as `createRouter`, `RouterLink`, `RouterView`, `useRouter`, `useRoute`, navigation guards, and route meta etc.

[![Npm](https://img.shields.io/npm/v/@vureact/router.svg?label=Npm&style=flat-square)](https://www.npmjs.com/package/@vureact/router)
[![Downloads](https://img.shields.io/npm/dt/@vureact/router?label=Downloads&style=flat-square)](https://www.npmjs.com/package/@vureact/router)
[![Monthly](https://img.shields.io/npm/dm/@vureact/router?label=Monthly&style=flat-square)](https://www.npmjs.com/package/@vureact/router)
[![Coverage](https://codecov.io/gh/vureact-js/vureact-router/graph/badge.svg?flag=router&style=flat-square)](https://codecov.io/gh/vureact-js/vureact-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/vureact-js/vureact-router/blob/master/LICENSE)
[![React >=18](https://img.shields.io/badge/React->=18-61dafb)](https://reactjs.org/)

[Docs](https://router.vureact.top/en) · [Quick Start](https://router.vureact.top/en/guide/quick-start.html) · [API](https://router.vureact.top/en/api/create-router.html) · [npm](https://www.npmjs.com/package/@vureact/router) · [Issues](https://github.com/vureact-js/vureact-router/issues)

English | [简体中文](./README.md)

</div>

## Why this project exists

When migrating a Vue project to React, routing is often one of the hardest mental-model shifts.

`@vureact/router` is not trying to reinvent routing. Its goal is to let you keep a Vue Router 4.x-like authoring style inside React, including:

- `createRouter`
- `createWebHashHistory` / `createWebHistory`
- `RouterLink` / `RouterView`
- `useRouter` / `useRoute`
- `beforeEach` / `afterEach` / `beforeResolve`
- route meta, nested routes, and dynamic routes

Under the hood, it still builds on React Router DOM, so it stays aligned with the React ecosystem.

## Core features

- **Vue Router-style API** for teams familiar with Vue Router
- **Built on React Router DOM 7.9+**
- **Full TypeScript support**
- **Navigation guards** at both global and component level
- **Nested routes and route meta**
- **Async components and code splitting**
- **Active link styling** similar to Vue Router link states

## Who it is for

- Teams migrating Vue 3 + Vue Router projects to React
- React projects that want Vue Router-style APIs
- Projects using `@vureact/compiler-core` and needing router adaptation
- Mixed Vue/React teams that want to reduce context switching

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

## The capabilities you will use most

### 1. Programmatic navigation

```tsx
import { useRouter } from '@vureact/router';

function Toolbar() {
  const router = useRouter();

  return <button onClick={() => router.push('/about')}>Go to About</button>;
}
```

### 2. Accessing the current route

```tsx
import { useRoute } from '@vureact/router';

function CurrentRouteInfo() {
  const route = useRoute();
  return <pre>{JSON.stringify(route, null, 2)}</pre>;
}
```

### 3. Global guards

```tsx
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login';
  }
  return true;
});
```

### 4. Component-level guards

```tsx
import { useBeforeRouteLeave } from '@vureact/router';

function EditorPage() {
  useBeforeRouteLeave(() => {
    if (hasUnsavedChanges()) {
      return confirm('You have unsaved changes. Leave anyway?');
    }
    return true;
  });

  return <div>Editor</div>;
}
```

## Relationship to Vue Router

If you already know Vue Router, most of the API should feel familiar:

| Vue Router | @vureact/router |
| --- | --- |
| `createRouter()` | `createRouter()` |
| `<router-view>` | `<RouterView>` |
| `<router-link>` | `<RouterLink>` |
| `useRouter()` | `useRouter()` |
| `useRoute()` | `useRoute()` |
| global guards | global guards |
| route meta | route meta |

It is not a source-level port of Vue Router. It is a React-side adaptation layer with a Vue Router-like experience.

## Repository structure

- `packages/router` - the published npm package `@vureact/router`

## Documentation

- [Introduction](https://router.vureact.top/en/guide/introduction.html)
- [Quick Start](https://router.vureact.top/en/guide/introduction.html)
- [Navigation Guards](https://router.vureact.top/en/guide/guards.html)
- [API Docs](https://router.vureact.top/en/api/)
- [Changelog](https://router.vureact.top/en/guide/changelog.html)

## Related projects

- [VuReact](https://vureact.top/en)
- [@vureact/compiler-core](https://vureact.top/en)
- [@vureact/runtime-core](https://runtime.vureact.top/en)

## Contributing and license

- [Issue tracker](https://github.com/vureact-js/vureact-router/issues)
- [Contributing guide](./CONTRIBUTING.md)

MIT © Ruihong Zhong (Ryan John)
