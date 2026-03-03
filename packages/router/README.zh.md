# @vureact/router

简体中文 | [English](./README.md)

Vue Router 4.x 风格的 React 18+ 路由适配器（基于 React Router DOM 7.9+ 封装）

## ✨ 特性

- **Vue Router API 兼容性**: 为从 Vue.js 转向 React 的开发者提供熟悉的 API
- **基于 React Router DOM**: 基于稳定且功能丰富的 React Router DOM 7.9+ 构建
- **TypeScript 优先**: 完整的 TypeScript 支持，提供全面的类型定义
- **路由守卫**: 支持 `beforeEach`、`beforeResolve`、`afterEach` 导航守卫
- **异步组件**: 内置代码分割和懒加载支持
- **动态路由**: 支持编程式路由添加和操作
- **嵌套路由**: 完整的嵌套路由配置支持
- **路由元信息**: 为路由附加元数据以支持自定义逻辑
- **活动链接类**: 自动管理活动链接的 CSS 类
- **多种历史模式**: 支持 hash、browser 和 memory 历史模式

## 📦 安装

```bash
npm install @vureact/router
# 或
yarn add @vureact/router
# 或
pnpm add @vureact/router
```

### 对等依赖

- React >= 18.2.0
- React DOM >= 18.2.0
- React Router DOM >= 7.9.0

## 🚀 快速开始

### 基础设置

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter, RouterView, RouterLink } from '@vureact/router';

// 定义路由
const routes = [
  {
    path: '/',
    component: <div>首页</div>,
  },
  {
    path: '/about',
    component: <div>关于页面</div>,
  },
  {
    path: '/users/:id',
    component: <div>用户资料</div>,
  },
];

// 创建路由实例
const router = createRouter({
  routes,
  history: 'hash', // 或 'browser'、'memory'
});

// 应用组件
function App() {
  return (
    <div>
      <nav>
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
        <RouterLink to="/users/123">用户 123</RouterLink>
      </nav>
      <RouterView />
    </div>
  );
}

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <router.RouterProvider>
    <App />
  </router.RouterProvider>,
);
```

## 📖 API 参考

### 核心函数

#### `createRouter(options: CreateRouterOptions): RouterInstance`

使用给定配置创建路由实例。

```tsx
const router = createRouter({
  routes: [...],
  history: 'hash', // 'hash' | 'browser' | 'memory'
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
});
```

#### `RouterInstance` 方法

- `router.beforeEach(guard: GuardWithNextFn)`: 注册全局前置导航守卫
- `router.beforeResolve(guard: GuardWithNextFn)`: 注册全局解析守卫
- `router.afterEach(guard: AfterEachGuard)`: 注册全局后置导航守卫
- `router.onError(handler: ErrorHandler)`: 注册全局错误处理器
- `router.addRoute(route: RouteConfig)`: 添加新路由
- `router.addRoute(parentName: string, route: RouteConfig)`: 添加嵌套路由
- `router.hasRoute(name: string)`: 检查路由是否存在（通过名称）
- `router.resolve(to: string | RouterOptions)`: 解析路由位置
- `router.getRoutes()`: 获取所有已注册路由
- `router.clearAll()`: 清除所有路由和守卫

### 组件

#### `RouterView`

渲染匹配的路由组件。

```tsx
<RouterView customRender={(component, route) => <div>{component}</div>} />
```

#### `RouterLink`

用于在路由之间导航的组件。

```tsx
<RouterLink
  to="/about"
  activeClassName="active-link"
  exactActiveClassName="exact-active-link"
  custom={({ href, isActive, navigate }) => (
    <button onClick={navigate} className={isActive ? 'active' : ''}>
      前往关于页面
    </button>
  )}
>
  关于
</RouterLink>
```

### 钩子

#### `useRouter()`

用于编程式导航的钩子，访问路由实例。

```tsx
import { useRouter } from '@vureact/router';

function MyComponent() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/about');
    // 或
    router.push({ path: '/about', query: { tab: 'info' } });
  };

  return <button onClick={handleClick}>前往关于页面</button>;
}
```

#### `useRoute()`

访问当前路由信息的钩子。

```tsx
import { useRoute } from '@vureact/router';

function MyComponent() {
  const route = useRoute();

  return (
    <div>
      <p>当前路径: {route.path}</p>
      <p>查询参数: {JSON.stringify(route.query)}</p>
      <p>路由参数: {JSON.stringify(route.params)}</p>
      <p>路由元信息: {JSON.stringify(route.meta)}</p>
    </div>
  );
}
```

#### 路由守卫钩子

- `useBeforeRouteEnter(guard: ComponentGuard)`: 组件级进入前守卫
- `useBeforeRouteLeave(guard: ComponentGuard)`: 组件级离开前守卫
- `useBeforeRouteUpdate(guard: ComponentGuard)`: 组件级更新前守卫

### 路由配置

```tsx
const routes = [
  {
    path: '/',
    name: 'home',
    component: <HomePage />,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: <Dashboard />,
        meta: { title: '仪表板' },
      },
    ],
  },
  {
    path: '/login',
    component: <LoginPage />,
    meta: { guestOnly: true },
  },
  {
    path: '/users/:id',
    component: <UserProfile />,
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

## 🔒 路由守卫

### 全局守卫

```tsx
const router = createRouter({ routes });

// 每次导航前
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login';
  }

  if (to.meta.guestOnly && isAuthenticated()) {
    return '/';
  }

  return true; // 继续导航
});

// 每次导航后
router.afterEach((to, from) => {
  // 分析跟踪
  trackPageView(to.fullPath);
});

// 错误处理
router.onError((error) => {
  console.error('导航错误:', error);
});
```

### 组件守卫

```tsx
import { useBeforeRouteEnter, useBeforeRouteLeave } from '@vureact/router';

function UserProfile() {
  useBeforeRouteEnter((to, from) => {
    // 在组件挂载前调用
    return fetchUserData(to.params.id);
  });

  useBeforeRouteLeave((to, from) => {
    // 在离开组件前调用
    if (hasUnsavedChanges()) {
      return confirm('您有未保存的更改。确定要离开吗？');
    }
    return true;
  });

  return <div>用户资料</div>;
}
```

## 🔄 异步组件与代码分割

```tsx
const routes = [
  {
    path: '/dashboard',
    component: () => import('./Dashboard'),
    meta: {
      loadingComponent: <div className="loading-spinner">加载仪表板中...</div>,
    },
  },
  {
    path: '/admin',
    component: lazy(() => import('./AdminPanel')),
  },
];
```

## 🎨 活动链接样式

```css
/* 默认类 */
.router-link-active {
  /* 当链接的路由处于活动状态时应用 */
}

.router-link-exact-active {
  /* 当链接的路由完全匹配时应用 */
}

/* 自定义类 */
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
  关于
</RouterLink>
```

## 📝 TypeScript 支持

完整的 TypeScript 支持，提供全面的类型定义：

```tsx
import type { RouteConfig, RouterInstance, RouteLocation, RouterOptions } from '@vureact/router';

// 类型安全的路由配置
const routes: RouteConfig[] = [
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

// 类型安全的导航
const router = useRouter();
router.push({ name: 'user', params: { id: '123' } });
```

## 🔧 高级用法

### 动态路由添加

```tsx
const router = createRouter({ routes: [] });

// 动态添加路由
router.addRoute({
  path: '/dynamic',
  component: <DynamicPage />,
});

// 添加嵌套路由
router.addRoute('parent', {
  path: 'child',
  component: <ChildPage />,
});
```

### 自定义查询参数解析

```tsx
const router = createRouter({
  routes,
  parseQuery: (search) => {
    // 自定义查询参数解析逻辑
    return customParse(search);
  },
  stringifyQuery: (query) => {
    // 自定义查询参数序列化
    return customStringify(query);
  },
});
```

### 路由解析

```tsx
const router = createRouter({ routes });

// 解析路由位置
const location = router.resolve('/users/123?tab=profile');
// 或
const location = router.resolve({
  name: 'user',
  params: { id: '123' },
  query: { tab: 'profile' },
});

console.log(location.fullPath); // "/users/123?tab=profile"
console.log(location.params); // { id: '123' }
console.log(location.query); // { tab: 'profile' }
```

## 🤝 从 Vue Router 迁移

如果您熟悉 Vue Router，您会发现 @vureact/router 非常相似：

| Vue Router       | @vureact/router  | 说明                    |
| ---------------- | ---------------- | ----------------------- |
| `createRouter()` | `createRouter()` | 相同的 API              |
| `<router-view>`  | `<RouterView>`   | React 中使用 PascalCase |
| `<router-link>`  | `<RouterLink>`   | React 中使用 PascalCase |
| `useRouter()`    | `useRouter()`    | 相同的 API              |
| `useRoute()`     | `useRoute()`     | 相同的 API              |
| 导航守卫         | 导航守卫         | 相同的守卫类型          |
| 路由元信息       | 路由元信息       | 相同的功能              |
| 嵌套路由         | 嵌套路由         | 相同的配置方式          |

## 📚 示例

查看 [examples 目录](../../examples/README.zh.md) 获取更多使用示例。

## 🐛 故障排除

### 常见问题

1. **"RouterProvider 必须在 Router 上下文中使用"**
   - 确保您的应用使用 `<router.RouterProvider>` 包裹

2. **路由不匹配**
   - 检查您的路由路径，确保它们正确嵌套
   - 在 `RouterLink` 上使用 `exact` 属性进行精确匹配

3. **TypeScript 错误**
   - 确保您有最新的 TypeScript 版本
   - 检查您的 tsconfig.json 中的模块解析配置

## 📄 许可证

MIT © [Ryan John](./LICENSE)

## 🔗 链接

- [GitHub 仓库](https://github.com/vureact-js/vureact-router)
- [npm 包](https://www.npmjs.com/package/@vureact/router)
- [文档](https://router.vureact.top)
- [问题跟踪](https://github.com/vureact-js/vureact-router/issues)
- [贡献指南](../../CONTRIBUTING.zh.md)
