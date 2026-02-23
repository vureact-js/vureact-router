# Contributing to Vureact Router

Thank you for your interest in contributing to Vureact Router! This document provides guidelines and instructions for contributing to the project.

## 🎯 Before You Start

### Project Overview

Vureact Router is a Vue Router 4.x style routing library for React 18+, built on top of React Router DOM 7.9+. It provides familiar Vue Router APIs for developers transitioning from Vue.js to React.

### Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for everyone.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0 (recommended)
- Git

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/vureact-router.git
   cd vureact-router
   ```

3. **Install dependencies**:

   ```bash
   pnpm install
   ```

4. **Build the project**:

   ```bash
   pnpm build:router
   ```

5. **Run tests** to ensure everything works:

   ```bash
   pnpm test:router
   ```

## 📝 Development Workflow

### Branch Strategy

- `main`: Stable production branch
- `develop`: Development branch (if exists)
- Feature branches: `feature/description`
- Bug fix branches: `fix/issue-number-description`
- Documentation branches: `docs/topic`

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Write code** following our coding standards
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Run tests** locally:

   ```bash
   pnpm test:router
   ```

5. **Check code style**:

   ```bash
   pnpm lint
   pnpm format:check
   ```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(router): add navigation guard support
fix(link): correct active class application
docs(readme): update installation instructions
```

### Testing

- Write unit tests for new features
- Ensure existing tests pass
- Test edge cases
- Run the full test suite:

  ```bash
  pnpm test:router
  ```

### Code Quality

- Run linter: `pnpm lint`
- Fix formatting issues: `pnpm format`
- Ensure TypeScript compiles without errors

## 🔧 Project Structure

```
vureact-router/
├── packages/
│   └── router/          # @vureact/router package
│       ├── src/         # Source code
│       │   ├── components/    # React components
│       │   ├── hooks/         # Custom hooks
│       │   ├── types/         # TypeScript definitions
│       │   ├── utils/         # Utility functions
│       │   └── index.ts       # Main entry point
│       ├── __tests__/   # Test files
│       └── package.json # Package configuration
├── examples/            # Example applications
└── docs/               # Documentation
```

## 📖 Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Provide proper type definitions
- Avoid `any` type when possible
- Use interfaces for object shapes

### React Components

- Use functional components with hooks
- Follow React best practices
- Use proper prop types/interfaces
- Implement proper error boundaries

### Code Style

- Use 2-space indentation
- Use semicolons
- Use single quotes for strings
- Follow ESLint and Prettier configurations

### Documentation

- Document public APIs with JSDoc comments
- Update README files when adding features
- Add examples for complex functionality

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: Node.js version, OS, browser, etc.
6. **Code Example**: Minimal reproduction code

### Feature Requests

For feature requests, please:

1. **Describe the problem** you're trying to solve
2. **Explain why** this feature is needed
3. **Provide examples** of how it would be used
4. **Consider alternatives** you've tried

## 🔄 Pull Request Process

1. **Ensure your branch is up to date**:

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all checks**:

   ```bash
   pnpm build:router
   pnpm test:router
   pnpm lint
   pnpm format:check
   ```

3. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Reference related issues
   - Provide a detailed description
   - Include screenshots for UI changes

4. **PR Review Process**:
   - Address review comments promptly
   - Keep commits focused and logical
   - Squash commits if needed
   - Ensure CI passes

5. **After Approval**:
   - Maintainers will merge your PR
   - Your changes will be included in the next release

## 🧪 Testing Guidelines

### Writing Tests

- Test public APIs thoroughly
- Test edge cases and error conditions
- Mock external dependencies
- Use descriptive test names

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test:router

# Run tests in watch mode
pnpm test:router -- --watch

# Run specific test file
pnpm test:router -- path/to/test.ts
```

## 📚 Documentation

### Updating Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new APIs
- Update TypeScript definitions
- Add examples for new features

### Building Documentation

```bash
# Check if documentation builds correctly
# (Add documentation build command when available)
```

## 🏗️ Building and Packaging

### Development Build

```bash
pnpm build:router
```

### Production Build

The build process is handled by Rollup. Configuration is in `rollup.config.cjs`.

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 🤝 Community

### Getting Help

- [GitHub Issues](https://github.com/vureact-js/vureact-router/issues) for bug reports
- [GitHub Discussions](https://github.com/vureact-js/vureact-router/discussions) for questions
- Check existing documentation first

### Recognition

All contributors will be recognized in:

- Release notes
- Contributors list
- Project documentation

## 📄 License

By contributing to Vureact Router, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## 🙏 Thank You

Thank you for considering contributing to Vureact Router. Your efforts help make this project better for everyone in the React and Vue communities!

---

_Need help? Open an issue or join the discussion on GitHub!_
