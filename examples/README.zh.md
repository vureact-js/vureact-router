# @vureact/router examples

`examples` 是 `@vureact/router` 的演示工程，使用 Vite + React + TypeScript。

## 运行方式

```bash
cd vureact-router/examples
npm install
npm run dev
```

默认使用 hash 路由模式，浏览器打开后从 `#/home` 进入示例目录页。

## 本地源码 alias 说明

示例没有依赖已发布的 npm 包，而是通过 alias 直接指向仓库内源码：

- Vite alias: `@vureact/router -> ../packages/router/src/index.ts`
- TS paths: `@vureact/router -> ../packages/router/src/index.ts`

这样在修改 `packages/router/src` 后，示例可立即联调验证。

## 六大核心示例

1. `01 基础路由`：基础路由、嵌套路由、404 兜底。
2. `02 RouterLink`：字符串/对象跳转、`query/hash`、`customRender`、`replace`。
3. `03 useRouter/useRoute`：`push/replace/back/forward/go/resolve/current` 与 route 信息面板。
4. `04 全局守卫`：`beforeEach`、`beforeResolve`、`afterEach`、`onError`，并展示导航失败信息。
5. `05 组件守卫`：`useBeforeRouteLeave`、`useBeforeRouteUpdate`、`useBeforeRouteEnter`。
6. `06 动态路由`：`addRoute`、`hasRoute`、`resolve` 与运行时注入后跳转。

## 定位

这个示例工程用于 API 演示与联调验证，不追求完整产品级 UI。
