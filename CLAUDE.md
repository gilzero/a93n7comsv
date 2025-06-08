# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit application using Svelte 5 with TypeScript, Tailwind CSS v4, and comprehensive testing setup.

## Package Manager

**IMPORTANT**: This project uses Bun as the package manager. Always use `bun` commands instead of `npm`:
- `bun install` instead of `npm install`
- `bun run` instead of `npm run`
- `bun add` instead of `npm add`

## Essential Commands

### Development
```bash
bun run dev              # Start development server
bun run dev -- --open    # Start dev server and open browser
bun run preview          # Preview production build after running build
```

### Build & Type Checking
```bash
bun run build            # Build for production
bun run check            # Type-check with svelte-check
bun run check:watch      # Type-check in watch mode
bun run lint             # Run ESLint
```

### Testing
```bash
bun run test             # Run all tests (E2E + unit)
bun run test:unit        # Run unit tests with Vitest
bun run test:e2e         # Run E2E tests with Playwright
```

To run a single test file:
```bash
bun run test:unit src/routes/page.svelte.test.ts
bun run test:e2e e2e/demo.test.ts
```

## Architecture & Key Patterns

### Project Structure
- `/src/routes/` - SvelteKit pages and layouts using file-based routing
- `/src/lib/` - Shared components and utilities (accessible via `$lib` alias)
- `/e2e/` - Playwright E2E tests
- Component tests are co-located with components (e.g., `page.svelte.test.ts`)

### Technology Stack
- **Framework**: SvelteKit with Svelte 5 (uses runes like `$props()`, `$state()`)
- **Styling**: Tailwind CSS v4 integrated via Vite plugin
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Build Tool**: Vite
- **Package Manager**: Bun (use `bun` commands exclusively)

### Testing Patterns

**Unit Tests (Vitest + Testing Library)**:
- Use `@testing-library/svelte` for component testing
- Tests focus on user behavior and accessibility
- Example pattern:
  ```typescript
  import { render, screen } from '@testing-library/svelte';
  import Component from './Component.svelte';
  
  test('displays content', () => {
    render(Component);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
  ```

**E2E Tests (Playwright)**:
- Tests run against built preview server on port 4173
- Use page objects and async/await patterns
- Example:
  ```typescript
  test('navigates to page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading')).toBeVisible();
  });
  ```

### Key Configuration Notes
- TypeScript is configured with strict mode
- Vitest has separate workspaces for client (jsdom) and server (node) tests
- ESLint uses flat config format with TypeScript and Svelte plugins
- The project uses Svelte 5 features, so use modern rune syntax ($props, $state, etc.)