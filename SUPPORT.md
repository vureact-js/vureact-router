# Support

## Getting Help

If you need help with Vureact Router, here are the best ways to get support:

### Documentation

- **[README.md](./README.md)** - Project overview and quick start
- **[Documentation Website](https://router-vureact.vercel.app/en)** - Complete documentation
- **[Examples](./examples/)** - Example applications

### Community Support

- **[GitHub Discussions](https://github.com/vureact-js/vureact-router/discussions)** - Ask questions, share ideas, and get help from the community
- **[GitHub Issues](https://github.com/vureact-js/vureact-router/issues)** - Report bugs or request features

### Before Asking for Help

To help us help you, please:

1. **Search existing issues and discussions** - Your question may have already been answered
2. **Check the documentation** - Many questions are answered in the docs
3. **Provide a minimal reproduction** - Create a small example that demonstrates the issue
4. **Include relevant information**:
   - Vureact Router version
   - React version
   - Node.js version
   - Browser and version (if applicable)
   - Error messages and stack traces

## FAQ

### Common Questions

**Q: How does Vureact Router differ from React Router?**
A: Vureact Router provides a Vue Router 4.x compatible API on top of React Router DOM. It's designed for developers transitioning from Vue.js to React who want to use familiar routing patterns.

**Q: Is Vureact Router production ready?**
A: Yes, Vureact Router is stable and ready for production use. However, as with any open-source project, we recommend thorough testing in your specific environment.

**Q: Can I use Vureact Router with TypeScript?**
A: Yes, Vureact Router has full TypeScript support with comprehensive type definitions.

**Q: Are navigation guards supported?**
A: Yes, Vureact Router supports `beforeEach`, `beforeResolve`, and `afterEach` navigation guards similar to Vue Router.

## Troubleshooting

### Common Issues

#### Router not working

- Ensure your app is wrapped with `<router.RouterProvider>`
- Check that routes are correctly configured
- Verify that you're using the correct history mode

#### TypeScript errors

- Make sure you have the correct TypeScript version (>=5.9.3)
- Check your tsconfig.json configuration
- Ensure proper module resolution

#### Build errors

- Clear node_modules and reinstall: `pnpm clean && pnpm install`
- Check Node.js version (>=16.0.0 required)
- Verify pnpm version (>=8.0.0 recommended)

### Debugging Tips

1. **Enable debug logging**:

   ```typescript
   const router = createRouter({
     routes: [...],
     history: 'hash',
     debug: true, // Enable debug mode
   });
   ```

2. **Check router state**:

   ```typescript
   import { useRouter } from '@vureact/router';

   function Component() {
     const router = useRouter();
     console.log('Current route:', router.currentRoute.value);
     // ...
   }
   ```

3. **Inspect navigation guards**:

   ```typescript
   router.beforeEach((to, from, next) => {
     console.log('Navigation from:', from);
     console.log('Navigation to:', to);
     next();
   });
   ```

## Reporting Issues

When reporting issues, please use our [Issue Template](./.github/ISSUE_TEMPLATE.md) and include:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Code examples
- Environment details

## Feature Requests

For feature requests, please:

1. Check if the feature already exists
2. Explain the problem you're trying to solve
3. Provide use cases and examples
4. Consider alternative solutions

Submit feature requests through [GitHub Issues](https://github.com/vureact-js/vureact-router/issues).

## Contributing

If you'd like to contribute to Vureact Router, please see our [Contributing Guidelines](./CONTRIBUTING.md).

## Commercial Support

Currently, Vureact Router is maintained by volunteers. For commercial support inquiries, please contact us through GitHub Discussions.

## Stay Updated

- **Star the repository** to show your support
- **Watch the repository** to get notifications of new releases
- **Follow releases** on [GitHub Releases](https://github.com/vureact-js/vureact-router/releases)

---

_Need immediate help? Check our [GitHub Discussions](https://github.com/vureact-js/vureact-router/discussions) for community support._
