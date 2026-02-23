# 提交约定

本文档概述了 Vureact Router 项目中使用的提交消息约定。遵循此约定有助于维护干净和可读的提交历史。

## 格式

每个提交消息由**标题**、可选的**正文**和可选的**页脚**组成。

```xml
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 页脚]
```

## 标题

标题是必需的，必须遵循以下格式：

### 类型

必须是以下之一：

- **feat**: 新功能
- **fix**: 错误修复
- **docs**: 仅文档更改
- **style**: 不影响代码含义的更改（空格、格式化、缺少分号等）
- **refactor**: 既不修复错误也不添加功能的代码更改
- **perf**: 提高性能的代码更改
- **test**: 添加缺失的测试或更正现有测试
- **build**: 影响构建系统或外部依赖项的更改
- **ci**: 对我们的 CI 配置文件和脚本的更改
- **chore**: 不修改 src 或测试文件的其他更改
- **revert**: 恢复先前的提交

### 范围（可选）

范围应该是受影响的包或组件的名称。示例：

- `router`: 主路由器包的更改
- `link`: RouterLink 组件的更改
- `view`: RouterView 组件的更改
- `hooks`: 自定义钩子的更改
- `types`: TypeScript 定义的更改
- `examples`: 示例应用的更改
- `docs`: 文档更改
- `deps`: 依赖项更新

### 描述

- 使用祈使句、现在时态："change" 而不是 "changed" 或 "changes"
- 不要大写第一个字母
- 结尾不要有点（.）
- 保持简洁（理想情况下 50 个字符或更少）

## 正文（可选）

- 使用祈使句、现在时态
- 包括更改的动机以及与先前行为的对比
- 在 72 个字符处换行
- 自由引用问题和拉取请求

## 页脚（可选）

### 破坏性更改

如果有破坏性更改，页脚应以 `BREAKING CHANGE:` 开头，后跟更改的描述、理由和迁移说明。

### 问题引用

使用关键字关闭问题：

- `Fixes #123`
- `Closes #123`
- `Resolves #123`

## 示例

### 简单修复

```txt
fix(link): 修正嵌套路由上的激活类应用
```

### 带范围的功能

```txt
feat(router): 添加导航守卫支持

- 实现 beforeEach、beforeResolve 和 afterEach 守卫
- 添加守卫类型定义
- 使用示例更新文档

Fixes #45
```

### 破坏性更改

```txt
feat(router): 将 createRouter API 更改为接受选项对象

BREAKING CHANGE: createRouter 现在接受选项对象而不是
单独的参数。将你的代码从：
createRouter(routes, history)
更新为：
createRouter({ routes, history })
```

### 文档更新

```txt
docs: 更新 pnpm 的安装说明

添加 pnpm 特定的安装步骤和故障排除提示。
```

### 依赖项更新

```txt
chore(deps): 将 react-router-dom 更新到 v7.9.0
```

## 最佳实践

1. **保持提交专注**：每个提交应代表一个单一的逻辑更改
2. **编写描述性消息**：消息应清楚解释更改了什么以及为什么
3. **引用问题**：链接到相关的问题或拉取请求
4. **提交前测试**：确保你的更改不会破坏现有功能
5. **使用约定格式**：遵循类型-范围-描述格式

## 工具

### Commitizen

对于交互式提交消息构建器，你可以使用 Commitizen：

```bash
npx cz
```

### Commitlint

为了验证提交消息，我们使用带有常规配置的 commitlint。

### Husky

我们使用 Husky 在 commit-msg 钩子上运行 commitlint。

## 资源

- [约定式提交](https://www.conventionalcommits.org/zh-hans/)
- [Angular 提交消息指南](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Commitizen](https://github.com/commitizen/cz-cli)
