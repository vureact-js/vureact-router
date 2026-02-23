# 支持

## 获取帮助

如果你需要 Vureact Router 的帮助，以下是获取支持的最佳方式：

### 文档

- **[README.zh.md](./README.zh.md)** - 项目概述和快速开始
- **[文档网站](https://router-vureact.vercel.app)** - 完整文档
- **[示例](./examples/)** - 示例应用

### 社区支持

- **[GitHub Discussions](https://github.com/vureact-js/vureact-router/discussions)** - 提问、分享想法并从社区获取帮助
- **[GitHub Issues](https://github.com/vureact-js/vureact-router/issues)** - 报告错误或请求功能

### 在寻求帮助之前

为了帮助我们帮助你，请：

1. **搜索现有问题和讨论** - 你的问题可能已经被回答
2. **检查文档** - 许多问题在文档中有答案
3. **提供最小重现** - 创建一个小示例来演示问题
4. **包含相关信息**：
   - Vureact Router 版本
   - React 版本
   - Node.js 版本
   - 浏览器和版本（如果适用）
   - 错误消息和堆栈跟踪

## 常见问题

**问：Vureact Router 与 React Router 有何不同？**
答：Vureact Router 在 React Router DOM 之上提供了 Vue Router 4.x 兼容的 API。它专为从 Vue.js 转向 React 并希望使用熟悉的路由模式的开发者设计。

**问：Vureact Router 可以用于生产环境吗？**
答：是的，Vureact Router 稳定且可用于生产环境。但是，与任何开源项目一样，我们建议在你的特定环境中进行彻底测试。

**问：我可以在 TypeScript 中使用 Vureact Router 吗？**
答：是的，Vureact Router 具有完整的 TypeScript 支持，包含全面的类型定义。

**问：支持导航守卫吗？**
答：是的，Vureact Router 支持类似于 Vue Router 的 `beforeEach`、`beforeResolve` 和 `afterEach` 导航守卫。

## 故障排除

### 路由器不工作

- 确保你的应用被 `<router.RouterProvider>` 包裹
- 检查路由是否正确配置
- 验证你使用的是正确的历史模式

#### TypeScript 错误

- 确保你有正确的 TypeScript 版本（>=5.9.3）
- 检查你的 tsconfig.json 配置
- 确保正确的模块解析

#### 构建错误

- 清除 node_modules 并重新安装：`pnpm clean && pnpm install`
- 检查 Node.js 版本（需要 >=16.0.0）
- 验证 pnpm 版本（推荐 >=8.0.0）

### 调试技巧

1. **启用调试日志**：

   ```typescript
   const router = createRouter({
     routes: [...],
     history: 'hash',
     debug: true, // 启用调试模式
   });
   ```

2. **检查路由器状态**：

   ```typescript
   import { useRouter } from '@vureact/router';

   function Component() {
     const router = useRouter();
     console.log('当前路由:', router.currentRoute.value);
     // ...
   }
   ```

3. **检查导航守卫**：

   ```typescript
   router.beforeEach((to, from, next) => {
     console.log('从路由导航:', from);
     console.log('导航到路由:', to);
     next();
   });
   ```

## 报告问题

报告问题时，请使用我们的[问题模板](./.github/ISSUE_TEMPLATE.zh.md)并包括：

- 问题的清晰描述
- 重现步骤
- 预期与实际行为
- 代码示例
- 环境详细信息

## 功能请求

对于功能请求，请：

1. 检查功能是否已存在
2. 解释你试图解决的问题
3. 提供用例和示例
4. 考虑替代解决方案

通过[GitHub Issues](https://github.com/vureact-js/vureact-router/issues)提交功能请求。

## 贡献

如果你想为 Vureact Router 做出贡献，请参阅我们的[贡献指南](./CONTRIBUTING.zh.md)。

## 商业支持

目前，Vureact Router 由志愿者维护。有关商业支持的咨询，请通过 GitHub Discussions 联系我们。

## 保持更新

- **给仓库点星**以表示你的支持
- **关注仓库**以获取新发布的通知
- **关注发布**在[GitHub Releases](https://github.com/vureact-js/vureact-router/releases)

---

_需要立即帮助？查看我们的[GitHub Discussions](https://github.com/vureact-js/vureact-router/discussions)获取社区支持。_
