# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-29

### Breaking

- 移除了 `@vureact/router/type-compat`。所有 Vue Router 风格类型现已从 `@vureact/router` 直接导出。
- 重命名公共类型：`CreateRouterOptions` → `RouterOptions`、`RouterInstance` → `Router`、`RouteConfig` → `RouteRecordRaw`。

### Changed

- `useRouter()` 现在返回主 `Router` 类型。
- 新增 `RouteLocationOptions`，并标准化定义 `RouteLocationRaw = string | RouteLocationOptions`。
- `NavigationFailureType` 包含 Vue 风格的 `duplicated` 枚举值，同时保留运行时扩展字段 `error`。

---

[2.0.0]: https://github.com/vureact-js/vureact-router/compare/v1.2.0...v2.0.0

---

## [1.2.0] - 2026-03-29

### Added

- **Vue Router类型兼容层**: 新增 `@vureact/router/type-compat` 子路径导出，提供与 Vue Router 4.x 兼容的类型别名
- **类型兼容文档**: 新增 `VUE_ROUTER_TYPE_COMPAT.md` 文档，详细说明类型兼容层的使用方法
- **类型别名支持**: 新增 `RouteRecordRaw`、`Router`、`RouterOptions` 等 Vue Router 兼容类型别名

### Changed

- **构建配置**: 更新 rollup 配置以支持 type-compat 模块的构建
- **示例项目**: 更新 examples 项目依赖，移除 react-router-dom 的直接依赖
- **文档清理**: 移除 SUPPORT.md 和 SUPPORT.zh.md 文件，简化项目结构

---

[1.2.0]: https://github.com/vureact-js/vureact-router/compare/v1.1.1...v1.2.0

---

## [1.1.1] - 2026-03-20

### Fixed

- 修复 `isReactComponentType` 函数无法正确识别 `memo`、`forwardRef`、`lazy` 等 React 高阶组件的问题

---

[1.1.1]: https://github.com/vureact-js/vureact-router/compare/v1.1.0...v1.1.1

---

## [1.1.0] - 2026-03-20

### Added

- **组件函数支持**: 路由配置中的 `component` 选项现在支持直接使用 React 组件函数（如 `component: App`）
- **智能组件类型检测**: 新增 `isReactComponentType` 工具函数，可准确识别 React 组件函数、类组件、高阶组件等
- **模块化代码结构**: 将大型 `createRouter.tsx` 文件拆分为模块化结构（`createRouter/index.tsx` 和 `createRouter/types.ts`）
- **路由容器工厂**: 新增 `createRouteContainer()` 函数，提供更好的路由配置隔离和测试支持

### Changed

- **路由配置语法**: 更新示例应用中的路由配置，使用更简洁的组件引用语法
- **组件处理逻辑**: 重构 `convertRoute` 函数，改进对组件类型的处理逻辑
- **类型定义**: 更新 `RouteConfig` 类型定义，`ComponentType` 现在支持 `FunctionComponent` 类型
- **路径解析**: 改进 `buildResolvedTo` 函数，增强路径解析的健壮性和空值处理
- **代码组织**: 改进代码组织结构，提高可维护性和可读性

### Fixed

- **类型导入**: 修复类型导入路径，确保正确的模块依赖关系
- **路由匹配**: 改进路由匹配逻辑，确保更准确的路由解析
- **组件渲染**: 修复组件渲染逻辑，正确处理各种组件类型

---

[1.1.0]: https://github.com/vureact-js/vureact-router/compare/v1.0.0...v1.1.0

---

```md
[Unreleased]: https://github.com/vureact-js/vureact-router/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/vureact-js/vureact-router/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/vureact-js/vureact-router/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/vureact-js/vureact-router/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/vureact-js/vureact-router/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/vureact-js/vureact-router/compare/v1.0.0...HEAD
```
