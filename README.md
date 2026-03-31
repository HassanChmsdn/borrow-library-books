# Borrow Library Books

Production-ready Next.js 16 starter for a library book borrowing platform. The repository is initialized with the App Router, TypeScript, Tailwind CSS 4, ESLint, Prettier, environment validation, and shadcn/ui.

## Scripts

```bash
npm run dev
npm run lint
npm run lint:fix
npm run typecheck
npm run format
npm run format:check
npm run build
```

## Environment variables

Environment validation lives in `src/env.ts` and is loaded from `next.config.ts` so invalid values fail fast during local development and production builds.

Create a local environment file when you add application variables:

```bash
cp .env.example .env.local
```

## Source structure

```text
src/
	app/          # Next.js routes, layouts, and global styles
	components/   # Reusable UI and composed view components
	hooks/        # Shared React hooks
	lib/          # Cross-cutting utilities
	modules/      # Feature-oriented application modules
	server/       # Server-only code and integrations
```

## Notes

- Use the `@/` alias for source imports.
- Add new environment variables to `src/env.ts` before consuming them.
- Add new primitives with `npx shadcn@latest add <component>`.
