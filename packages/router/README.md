# @vureact/router

**在 React 中使用 Vue Router 4.x 风格的路由 API。**

`@vureact/router` 是一个面向 React 18+ 的 **Vue Router 风格路由适配包**。  
它基于 React Router DOM 7.9+，提供熟悉的 `createRouter`、`RouterLink`、`RouterView`、`useRouter`、`useRoute`、导航守卫和路由元信息能力。

[![Downloads](https://img.shields.io/npm/dt/@vureact/router?label=Downloads&style=flat-square)](https://www.npmjs.com/package/@vureact/router)
[![Coverage](https://codecov.io/gh/vureact-js/vureact-router/graph/badge.svg?flag=router&style=flat-square)](https://codecov.io/gh/vureact-js/vureact-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React >=18](https://img.shields.io/badge/React->=18-61dafb)](https://reactjs.org/)

简体中文 | [English](./README.en.md)

## 这个包适合谁

- 正在把 Vue Router 项目迁移到 React
- 想在 React 中继续使用 Vue Router 风格 API
- 正在配合 [@vureact/compiler-core](https://www.npmjs.com/package/@vureact/compiler-core) 使用路由适配能力
- 团队成员更熟悉 Vue Router 的组织方式

## 安装

```bash
npm install @vureact/router
```

也可以使用：

```bash
pnpm add @vureact/router
yarn add @vureact/router
```

对等依赖：

- `react >= 18.2.0`
- `react-dom >= 18.2.0`
- `react-router-dom >= 7.9.0`

## 最小示例

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
    { path: '/', component: <div>首页</div> },
    { path: '/about', component: <div>关于</div> },
  ],
});

function App() {
  return (
    <div>
      <nav>
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
      <RouterView />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<router.RouterProvider />);
```

## 最常用的能力

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

### `RouterLink` 与 `RouterView`

```tsx
<RouterLink to="/about">关于</RouterLink>
<RouterView />
```

### `useRouter`

```tsx
import { useRouter } from '@vureact/router';

function Toolbar() {
  const router = useRouter();
  return <button onClick={() => router.push('/about')}>跳转</button>;
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

### 导航守卫

```tsx
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login';
  }
  return true;
});
```

## 从 Vue Router 迁移时的对应关系

| Vue Router | @vureact/router |
| --- | --- |
| `createRouter()` | `createRouter()` |
| `<router-view>` | `<RouterView>` |
| `<router-link>` | `<RouterLink>` |
| `useRouter()` | `useRouter()` |
| `useRoute()` | `useRoute()` |
| 导航守卫 | 导航守卫 |
| 路由元信息 | 路由元信息 |

## 这个包不负责什么

- 它不是通用状态管理库
- 它不是 Vue Router 的源码移植版本
- 它不是 Vue 到 React 的编译器；源码转换请使用 `@vureact/compiler-core`

## 文档入口

- [介绍](https://router.vureact.top/guide/introduction.html)
- [导航守卫](https://router.vureact.top/guide/guards.html)
- [API 文档](https://router.vureact.top/api/)

## 相关项目

- [@vureact/compiler-core](https://vureact.top)
- [@vureact/runtime-core](https://runtime.vureact.top)

## 仓库与许可证

- GitHub: <https://github.com/vureact-js/vureact-router>
- 文档: <https://router.vureact.top>

MIT © Ruihong Zhong (Ryan John)
