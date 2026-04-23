# Contributing to Tourista

:+1::tada: First off, thanks for taking the time to contribute. :tada::+1:

This repository is the Turborepo home for:

- `packages/tourista`: the published library
- `apps/touring-demo`: the demo app used to validate and showcase the library

## Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/RicSala/tourista/issues) in case the problem has already been reported.

When you create a bug report, include:

- A clear and descriptive title
- Exact steps to reproduce the problem
- Specific examples such as snippets, configuration, or screenshots
- The behavior you observed
- The behavior you expected
- Your environment details such as React version, Next.js version, browser, and OS

## Feature Requests & Implementation Questions

Before requesting a feature or asking about implementation:

1. Check the [README](README.md) and package docs in `packages/tourista/docs`
2. Browse existing issues and discussions
3. Review the demo app in `apps/touring-demo`

When opening a feature request:

- Use a clear and descriptive title
- Provide a detailed description of the proposed feature
- Explain the use case and why it is useful
- Include example usage if possible

## Pull Requests

Before submitting a pull request, open an issue first to discuss the change when it is not obviously a bug fix or doc correction.

### Development Setup

1. Fork and clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the workspace in development mode:

   ```bash
   pnpm dev
   ```

### Workspace Commands

Useful commands from the repository root:

```bash
pnpm build
pnpm lint
pnpm type:check
pnpm test
```

Useful package-specific commands:

```bash
pnpm --filter tourista build
pnpm --filter tourista type:check
pnpm --filter tourista test
pnpm --filter touring-demo build
```

### Pull Request Guidelines

- Use descriptive branch names such as `fix/overlay-scroll-issue` or `feat/typed-async-tasks`
- Keep TypeScript types accurate and consumer-friendly
- Update docs when APIs or recommended usage patterns change
- Prefer examples that reflect the current typed API, especially `useTour(config)` and `tasks.*`

### Before Submitting

Run the checks that are relevant to your change. For library and public API changes, the usual minimum is:

```bash
pnpm --filter tourista type:check
pnpm --filter tourista build
pnpm --filter touring-demo build
```

Note: `pnpm --filter touring-demo type:check` currently has a known generated-types issue around `apps/touring-demo/src/app/showcase/layout.tsx`, so treat that as existing repo noise unless your work touches that area.

### Documentation

When adding or modifying features:

- Update the relevant docs in `packages/tourista/docs`
- Keep demo usage in `apps/touring-demo` aligned with the recommended API
- Update package docs and examples if the public surface changes

## Questions?

If you have questions about contributing, feel free to:

- Open a [discussion](https://github.com/RicSala/tourista/discussions)
- Ask in an existing related issue
- Contact the maintainers

Thank you for contributing to Tourista.
