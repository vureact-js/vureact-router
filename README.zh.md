# Vureact Router

基于 React Router DOM 7.9+ 构建的 Vue Router 4.x 风格 React 18+ 路由库。为从 Vue.js 转向 React 的开发者提供熟悉的 Vue Router API。

## 🏗️ 项目结构

这是一个使用 pnpm workspaces 的 monorepo 项目。项目结构如下：

```txt
vureact-router/
├── packages/           # 包目录
│   └── router/        # @vureact/router 包
│       ├── src/       # 源代码
│       ├── dist/      # 构建产物
│       ├── package.json # 包配置
│       └── README.md  # 包文档
├── examples/          # 示例应用
│   ├── src/          # 示例源代码
│   ├── package.json  # 示例依赖
│   └── README.md     # 示例文档
├── package.json      # 根包配置
├── pnpm-workspace.yaml # 工作区配置
└── README.md         # 本文件
```

## 📦 包

### @vureact/router

主要的路由库包。这是您将在 React 应用中安装的包。

**主要特性：**

- Vue Router 4.x 兼容的 API
- 完整的 TypeScript 支持
- 导航守卫（beforeEach、beforeResolve、afterEach）
- 异步组件加载和代码分割
- 动态路由添加
- 嵌套路由支持
- 路由元信息字段
- 活动链接类管理
- 多种历史模式（hash、browser、memory）

**安装：**

```bash
npm install @vureact/router react-router-dom react react-dom
# 或
yarn add @vureact/router react-router-dom react react-dom
# 或
pnpm add @vureact/router react-router-dom react react-dom
```

**快速开始：**

```tsx
import { createRouter, RouterView, RouterLink } from '@vureact/router';

const router = createRouter({
  routes: [
    { path: '/', component: <div>首页</div> },
    { path: '/about', component: <div>关于</div> },
  ],
  history: 'hash',
});

function App() {
  return (
    <router.RouterProvider>
      <nav>
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
      <RouterView />
    </router.RouterProvider>
  );
}
```

详细文档请参阅 [packages/router/README.zh.md](./packages/router/README.zh.md)。

## 🚀 开始使用

### 先决条件

- Node.js >= 16.0.0
- pnpm >= 8.0.0（推荐）或 npm/yarn

### 开发环境设置

1. **克隆仓库：**

   ```bash
   git clone https://github.com/vureact-js/vureact-router.git
   cd vureact-router
   ```

2. **安装依赖：**

   ```bash
   pnpm install
   ```

3. **构建路由包：**

   ```bash
   pnpm build:router
   ```

4. **运行测试：**

   ```bash
   pnpm test:router
   ```

### 开发工作流

- **构建：** `pnpm build:router`
- **测试：** `pnpm test:router`
- **运行示例：** 进入 `examples/` 目录并运行 `pnpm dev`

## 📖 示例

`examples/` 目录包含展示 @vureact/router 各种功能的示例应用。

运行示例：

```bash
cd examples
pnpm install
pnpm dev
```

然后在浏览器中打开 `http://localhost:5173`（或终端显示的端口）。

示例展示的功能：

- 基础路由设置
- 嵌套路由
- 路由守卫
- 异步组件
- 动态路由添加
- 活动链接样式
- 编程式导航

## 🛠️ 开发

### 技术栈

- **React 18+** - UI 库
- **React Router DOM 7.9+** - 底层路由库
- **TypeScript** - 类型安全
- **Rollup** - 打包工具
- **Jest** - 测试框架
- **ESLint & Prettier** - 代码质量工具

### 贡献指南

我们欢迎贡献！详情请参阅 [贡献指南](./CONTRIBUTING.zh.md)。

1. Fork 本仓库
2. 创建功能分支
3. 进行更改
4. 为更改添加测试
5. 确保所有测试通过
6. 提交 Pull Request

## 📚 文档

### 包文档

- [@vureact/router 官网](https://router-vureact.vercel.app)
- [@vureact/router README](./packages/router/README.zh.md)

### 其他资源

- [TypeScript 配置](./tsconfig.base.json)
- [ESLint 配置](./eslint.config.js)
- [Prettier 配置](./.prettierrc.json)

## 🤝 从 Vue Router 迁移

如果您来自 Vue.js 和 Vue Router，@vureact/router 提供了熟悉的 API：

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

## 🐛 故障排除

### 常见问题

1. **构建错误**
   - 确保使用正确的 Node.js 版本（>=16）
   - 清除 node_modules 并重新安装：`pnpm clean && pnpm install`

2. **TypeScript 错误**
   - 检查 TypeScript 版本（>=5.9.3）
   - 确保 tsconfig.json 中的模块解析正确

3. **路由不工作**
   - 确保使用 `<router.RouterProvider>` 包裹应用
   - 检查路由配置是否正确

### 获取帮助

- [GitHub Issues](https://github.com/vureact-js/vureact-router/issues) - 报告错误或请求功能
- [GitHub Discussions](https://github.com/vureact-js/vureact-router/discussions) - 提问和分享想法

## 📄 许可证

本项目基于 MIT 许可证 - 详情请参阅 [LICENSE](./LICENSE) 文件。

## 🔗 链接

- [文档](https://router-vureact.vercel.app/en)
- [问题跟踪](https://github.com/vureact-js/vureact-router/issues)
- [更新日志](./CHANGELOG.md)

## 🙏 致谢

- [React Router](https://reactrouter.com/) - 提供优秀的底层路由库
- [Vue Router](https://router.vuejs.org/) - API 灵感来源
- 本项目的所有贡献者和用户
