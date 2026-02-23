# 贡献指南

感谢您有兴趣为 Vureact Router 做出贡献！本文档提供了贡献项目的指南和说明。

## 🎯 开始之前

### 项目概述

Vureact Router 是一个为 React 18+ 提供的 Vue Router 4.x 风格路由库，基于 React Router DOM 7.9+ 构建。它为从 Vue.js 转向 React 的开发者提供了熟悉的 Vue Router API。

### 行为准则

请阅读并遵循我们的[行为准则](CODE_OF_CONDUCT.md)，以确保为每个人提供友好的环境。

## 🚀 快速开始

### 先决条件

- Node.js >= 16.0.0
- pnpm >= 8.0.0（推荐）
- Git

### 开发环境设置

1. **在 GitHub 上 Fork 仓库**
2. **本地克隆你的 Fork**：

   ```bash
   git clone https://github.com/你的用户名/vureact-router.git
   cd vureact-router
   ```

3. **安装依赖**：

   ```bash
   pnpm install
   ```

4. **构建项目**：

   ```bash
   pnpm build:router
   ```

5. **运行测试**以确保一切正常：

   ```bash
   pnpm test:router
   ```

## 📝 开发流程

### 分支策略

- `main`: 稳定的生产分支
- `develop`: 开发分支（如果存在）
- 功能分支：`feature/描述`
- 修复分支：`fix/issue编号-描述`
- 文档分支：`docs/主题`

### 创建功能分支

```bash
git checkout -b feature/你的功能名称
```

### 进行更改

1. **编写代码**，遵循我们的编码标准
2. **为新功能添加测试**
3. **如果需要，更新文档**
4. **本地运行测试**：

   ```bash
   pnpm test:router
   ```

5. **检查代码风格**：

   ```bash
   pnpm lint
   pnpm format:check
   ```

### 提交指南

我们遵循[约定式提交](https://www.conventionalcommits.org/zh-hans/)规范：

```
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

**类型：**

- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更改
- `style`: 代码风格更改（格式化等）
- `refactor`: 代码重构
- `test`: 添加或更新测试
- `chore`: 维护任务

**示例：**

```
feat(router): 添加导航守卫支持
fix(link): 修正激活类应用
docs(readme): 更新安装说明
```

### 测试

- 为新功能编写单元测试
- 确保现有测试通过
- 测试边界情况
- 运行完整的测试套件：

  ```bash
  pnpm test:router
  ```

### 代码质量

- 运行代码检查：`pnpm lint`
- 修复格式化问题：`pnpm format`
- 确保 TypeScript 编译无错误

## 🔧 项目结构

```txt
vureact-router/
├── packages/
│   └── router/          # @vureact/router 包
│       ├── src/         # 源代码
│       │   ├── components/    # React 组件
│       │   ├── hooks/         # 自定义钩子
│       │   ├── types/         # TypeScript 定义
│       │   ├── utils/         # 工具函数
│       │   └── index.ts       # 主入口点
│       ├── __tests__/   # 测试文件
│       └── package.json # 包配置
├── examples/            # 示例应用
└── docs/               # 文档
```

## 📖 编码标准

### TypeScript

- 使用严格的 TypeScript 配置
- 提供适当的类型定义
- 尽可能避免使用 `any` 类型
- 使用接口定义对象形状

### React 组件

- 使用带有钩子的函数式组件
- 遵循 React 最佳实践
- 使用适当的属性类型/接口
- 实现适当的错误边界

### 代码风格

- 使用 2 空格缩进
- 使用分号
- 字符串使用单引号
- 遵循 ESLint 和 Prettier 配置

### 文档

- 使用 JSDoc 注释记录公共 API
- 添加功能时更新 README 文件
- 为复杂功能添加示例

## 🐛 报告问题

### 错误报告

报告错误时，请包括：

1. **描述**：问题的清晰描述
2. **重现步骤**：逐步说明
3. **预期行为**：你期望发生的事情
4. **实际行为**：实际发生的事情
5. **环境**：Node.js 版本、操作系统、浏览器等
6. **代码示例**：最小可重现代码

### 功能请求

对于功能请求，请：

1. **描述**你试图解决的问题
2. **解释为什么**需要这个功能
3. **提供示例**说明如何使用
4. **考虑**你尝试过的替代方案

## 🔄 拉取请求流程

1. **确保你的分支是最新的**：

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **运行所有检查**：

   ```bash
   pnpm build:router
   pnpm test:router
   pnpm lint
   pnpm format:check
   ```

3. **在 GitHub 上创建拉取请求**：
   - 使用清晰、描述性的标题
   - 引用相关的问题
   - 提供详细的描述
   - UI 更改请包含截图

4. **PR 审查流程**：
   - 及时处理审查意见
   - 保持提交内容专注且逻辑清晰
   - 如果需要，压缩提交
   - 确保 CI 通过

5. **批准后**：
   - 维护者将合并你的 PR
   - 你的更改将包含在下一个版本中

## 🧪 测试指南

### 编写测试

- 彻底测试公共 API
- 测试边界情况和错误条件
- 模拟外部依赖
- 使用描述性的测试名称

### 测试结构

```typescript
describe('组件名称', () => {
  it('应该做某事', () => {
    // 准备
    // 执行
    // 断言
  });
});
```

### 运行测试

```bash
# 运行所有测试
pnpm test:router

# 在监视模式下运行测试
pnpm test:router -- --watch

# 运行特定测试文件
pnpm test:router -- 路径/到/测试.ts
```

## 📚 文档

### 更新文档

- 为用户可见的更改更新 README.md
- 为新 API 添加 JSDoc 注释
- 更新 TypeScript 定义
- 为新功能添加示例

### 构建文档

```bash
# 检查文档是否正确构建
# （当有文档构建命令时添加）
```

## 🏗️ 构建和打包

### 开发构建

```bash
pnpm build:router
```

### 生产构建

构建过程由 Rollup 处理。配置在 `rollup.config.cjs` 中。

### 版本控制

我们遵循[语义化版本控制](https://semver.org/lang/zh-CN/)：

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

## 🤝 社区

### 获取帮助

- [GitHub Issues](https://github.com/vureact-js/vureact-router/issues) 用于错误报告
- [GitHub Discussions](https://github.com/vureact-js/vureact-router/discussions) 用于问题讨论
- 首先查看现有文档

### 认可

所有贡献者将在以下方面得到认可：

- 发布说明
- 贡献者列表
- 项目文档

## 📄 许可证

通过为 Vureact Router 做出贡献，你同意你的贡献将根据项目的[MIT 许可证](LICENSE)进行许可。

## 🙏 感谢

感谢你考虑为 Vureact Router 做出贡献。你的努力有助于让这个项目对 React 和 Vue 社区的每个人都变得更好！

---

_需要帮助？在 GitHub 上提出问题或加入讨论！_
