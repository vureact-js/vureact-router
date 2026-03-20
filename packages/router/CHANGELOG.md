# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

---
