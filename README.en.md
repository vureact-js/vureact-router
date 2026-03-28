<div align="center"><a name="readme-top"></a>

<img height="180" src="./logo.png" />

# VuReact Router

A Vue Router 4.x style routing library for React 18+, built on top of React Router DOM 7.9+. Provides familiar Vue Router APIs for developers transitioning from Vue.js to React.

[![npm version](https://img.shields.io/npm/v/@vureact/router.svg?style=flat-square)](https://vureact.top/)
[![npm downloads](https://img.shields.io/npm/dm/@vureact/router.svg?style=flat-square)](https://www.npmjs.com/package/@vureact/router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React 18+](https://img.shields.io/badge/React-18%2B-61dafb)](https://reactjs.org/)

简体中文 | [English](./README.md)

</div>

---

## 🏗️ Project Structure

This is a monorepo project using pnpm workspaces. The project structure is as follows:

```txt
vureact-router/
├── packages/
│   └── router/          # @vureact/router package
│       ├── src/         # Source code
│       ├── dist/        # Built artifacts
│       ├── package.json # Package configuration
│       └── README.md    # Package documentation
├── examples/            # Example applications
│   ├── src/            # Example source code
│   ├── package.json    # Example dependencies
│   └── README.md       # Example documentation
├── package.json        # Root package configuration
├── pnpm-workspace.yaml # Workspace configuration
└── README.md          # This file
```

## 📦 Packages

### @vureact/router

The main routing library package. This is the package you'll install in your React applications.

**Key Features:**

- Vue Router 4.x compatible API
- Full TypeScript support
- Navigation guards (beforeEach, beforeResolve, afterEach)
- Async component loading with code splitting
- Dynamic route addition
- Nested routes support
- Route meta fields
- Active link class management
- Multiple history modes (hash, browser, memory)

**Installation:**

```bash
npm install @vureact/router react-router-dom react react-dom
# or
yarn add @vureact/router react-router-dom react react-dom
# or
pnpm add @vureact/router react-router-dom react react-dom
```

**Quick Start:**

```tsx
import { createRouter, RouterView, RouterLink } from '@vureact/router';

const router = createRouter({
  routes: [
    { path: '/', component: <div>Home</div> },
    { path: '/about', component: <div>About</div> },
  ],
  history: 'hash',
});

function App() {
  return (
    <router.RouterProvider>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      <RouterView />
    </router.RouterProvider>
  );
}
```

For detailed documentation, see [packages/router/README.md](./packages/router/README.md).

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0 (recommended) or npm/yarn

### Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vureact-js/vureact-router.git
   cd vureact-router
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Build the router package:**

   ```bash
   pnpm build:router
   ```

4. **Run tests:**

   ```bash
   pnpm test:router
   ```

### Development Workflow

- **Build:** `pnpm build:router`
- **Test:** `pnpm test:router`
- **Run examples:** Navigate to `examples/` and run `pnpm dev`

## 📖 Examples

The `examples/` directory contains example applications demonstrating various features of @vureact/router.

To run the examples:

```bash
cd examples
pnpm install
pnpm dev
```

Then open your browser to `http://localhost:5173` (or the port shown in the terminal).

Example features demonstrated:

- Basic routing setup
- Nested routes
- Route guards
- Async components
- Dynamic route addition
- Active link styling
- Programmatic navigation

## 🛠️ Development

### Technology Stack

- **React 18+** - UI library
- **React Router DOM 7.9+** - Underlying routing library
- **TypeScript** - Type safety
- **Rollup** - Bundling
- **Jest** - Testing
- **ESLint & Prettier** - Code quality

### Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Submit a pull request

## 📚 Documentation

### Package Documentation

- [@vureact/router Documentation](https://router.vureact.top/en)
- [@vureact/router README](./packages/router/README.md)

### Additional Resources

- [TypeScript Configuration](./tsconfig.base.json)
- [ESLint Configuration](./eslint.config.js)
- [Prettier Configuration](./.prettierrc.json)

## 🤝 Migration from Vue Router

If you're coming from Vue.js and Vue Router, @vureact/router provides a familiar API:

| Vue Router        | @vureact/router   | Notes               |
| ----------------- | ----------------- | ------------------- |
| `createRouter()`  | `createRouter()`  | Same API            |
| `<router-view>`   | `<RouterView>`    | PascalCase in React |
| `<router-link>`   | `<RouterLink>`    | PascalCase in React |
| `useRouter()`     | `useRouter()`     | Same API            |
| `useRoute()`      | `useRoute()`      | Same API            |
| Navigation Guards | Navigation Guards | Same guard types    |
| Route Meta        | Route Meta        | Same functionality  |
| Nested Routes     | Nested Routes     | Same configuration  |

## 🐛 Troubleshooting

### Common Issues

1. **Build errors**
   - Ensure you have the correct Node.js version (>=16)
   - Clear node_modules and reinstall: `pnpm clean && pnpm install`

2. **TypeScript errors**
   - Check your TypeScript version (>=5.9.3)
   - Ensure proper module resolution in tsconfig.json

3. **Router not working**
   - Make sure you're wrapping your app with `<router.RouterProvider>`
   - Check that routes are correctly configured

### Getting Help

- [GitHub Issues](https://github.com/vureact-js/vureact-router/issues) - Report bugs or request features
- [GitHub Discussions](https://github.com/vureact-js/vureact-router/discussions) - Ask questions and share ideas

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [Documentation](https://router.vureact.top/en)
- [Issue Tracker](https://github.com/vureact-js/vureact-router/issues)
- [Changelog](./CHANGELOG.md)
- [VuReact](https://vureact.top/en)

## 🙏 Acknowledgments

- [React Router](https://reactrouter.com/) - For providing the excellent underlying routing library
- [Vue Router](https://router.vuejs.org/) - For the API inspiration
- All contributors and users of this project

---

**Built with ❤️ by the Vureact team**"
