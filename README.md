<div align="center"><a name="readme-top"></a>

<img height="180" src="./logo.png" />

# @vureact/router

**把 Vue Router 4.x 的使用习惯带到 React。**

> 一个面向 React 的 Vue Router 风格路由适配器。  
>
> 基于 React Router DOM 7.9+ 构建，提供熟悉的 `createRouter`、`RouterLink`、`RouterView`、`useRouter`、`useRoute`、导航守卫与路由元信息能力等。

[![Npm](https://img.shields.io/npm/v/@vureact/router.svg?label=Npm&style=flat-square)](https://www.npmjs.com/package/@vureact/router)
[![Downloads](https://img.shields.io/npm/dt/@vureact/router?label=Downloads&style=flat-square)](https://www.npmjs.com/package/@vureact/router)
[![Monthly](https://img.shields.io/npm/dm/@vureact/router?label=Monthly&style=flat-square)](https://www.npmjs.com/package/@vureact/router)
[![Coverage](https://codecov.io/gh/vureact-js/vureact-router/graph/badge.svg?flag=router&style=flat-square)](https://codecov.io/gh/vureact-js/vureact-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/vureact-js/vureact-router/blob/master/LICENSE)
[![React >=18](https://img.shields.io/badge/React->=18-61dafb)](https://reactjs.org/)

[文档](https://router.vureact.top) · [快速开始](https://router.vureact.top/guide/quick-start.html) · [API](https://router.vureact.top/api/create-router.html) · [npm](https://www.npmjs.com/package/@vureact/router) · [问题反馈](https://github.com/vureact-js/vureact-router/issues)

简体中文 | [English](./README.en.md)

</div>

## 为什么会有这个项目

如果你正在把 Vue 项目迁移到 React，路由通常是最难“心智平移”的部分之一。

`@vureact/router` 的目标不是重新发明一套路由系统，而是让你在 React 中继续使用尽可能接近 Vue Router 4.x 的开发方式，包括：

- `createRouter`
- `createWebHashHistory` / `createWebHistory`
- `RouterLink` / `RouterView`
- `useRouter` / `useRoute`
- `beforeEach` / `afterEach` / `beforeResolve`
- 路由元信息、嵌套路由、动态路由

底层仍然基于 React Router DOM，因此它不是一个脱离 React 生态的孤立实现。

## 核心特性

- **Vue Router 风格 API**：适合熟悉 Vue Router 的开发者快速迁移
- **基于 React Router DOM 7.9+**：复用成熟的 React 路由基础设施
- **完整 TypeScript 支持**：覆盖路由配置、导航、守卫和 hooks
- **导航守卫**：支持全局守卫和组件级守卫
- **嵌套路由与路由元信息**：保留 Vue Router 常见组织方式
- **异步组件与代码分割**：支持懒加载路由组件
- **活动链接样式**：支持类似 `router-link-active` 的链接状态类名

## 它适合谁

- 正在把 Vue 3 + Vue Router 项目迁移到 React
- 希望在 React 项目中保留 Vue Router 风格 API
- 正在配合 `@vureact/compiler-core` 使用路由适配能力
- 团队成员同时熟悉 Vue 和 React，希望减少切换成本

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

## 迁移时你会最常用到的能力

### 1. 编程式导航

```tsx
import { useRouter } from '@vureact/router';

function Toolbar() {
  const router = useRouter();

  return <button onClick={() => router.push('/about')}>前往关于页</button>;
}
```

### 2. 获取当前路由

```tsx
import { useRoute } from '@vureact/router';

function CurrentRouteInfo() {
  const route = useRoute();
  return <pre>{JSON.stringify(route, null, 2)}</pre>;
}
```

### 3. 全局守卫

```tsx
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login';
  }
  return true;
});
```

### 4. 组件级守卫

```tsx
import { useBeforeRouteLeave } from '@vureact/router';

function EditorPage() {
  useBeforeRouteLeave(() => {
    if (hasUnsavedChanges()) {
      return confirm('您有未保存的更改，确定离开吗？');
    }
    return true;
  });

  return <div>编辑页</div>;
}
```

## 与 Vue Router 的关系

如果你已经熟悉 Vue Router，那么大多数 API 会很直观：

| Vue Router | @vureact/router |
| --- | --- |
| `createRouter()` | `createRouter()` |
| `<router-view>` | `<RouterView>` |
| `<router-link>` | `<RouterLink>` |
| `useRouter()` | `useRouter()` |
| `useRoute()` | `useRoute()` |
| 全局守卫 | 全局守卫 |
| 路由元信息 | 路由元信息 |

它不是 Vue Router 的源码移植，而是在 React 语境里提供一套尽量贴近 Vue Router 的适配接口。

## 仓库结构

- `packages/router`：npm 发布包 `@vureact/router`

## 文档入口

- [介绍](https://router.vureact.top/guide/introduction.html)
- [快速开始](https://router.vureact.top/guide/introduction.html)
- [导航守卫](https://router.vureact.top/guide/guards.html)
- [API 文档](https://router.vureact.top/api/)
- [更新日志](https://router.vureact.top/guide/changelog.html)

## 相关项目

- [@vureact/compiler-core](https://vureact.top)
- [@vureact/runtime-core](https://runtime.vureact.top)

## 贡献与许可证

- [问题反馈](https://github.com/vureact-js/vureact-router/issues)
- [贡献指南](./CONTRIBUTING.zh.md)

MIT © Ruihong Zhong (Ryan John)
