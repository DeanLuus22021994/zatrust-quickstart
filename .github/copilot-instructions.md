# Copilot Instructions for Zatrust Quickstart

## Project Overview

This is a minimal, modular Next.js (TypeScript) starter focused on E2E testability, DRY principles, SRP (Single Responsibility Principle), SOLID principles, low-code patterns, and modular structure.

## Architecture & Structure

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: CSS (global styles in `src/app/globals.css`)
- **Testing**: Playwright for E2E testing
- **Auth**: Simple cookie-based demo auth (replace with NextAuth or IdP for production)
- **Development**: Docker Dev Container support

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/             # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   └── auth/              # Authentication-related components
└── middleware.ts          # Next.js middleware for route protection

tests/
└── e2e.spec.ts           # End-to-end tests

.devcontainer/            # Docker development container
```

## Development Guidelines

### Code Style & Conventions

1. **TypeScript Configuration**
   - Strict mode enabled with `noUncheckedIndexedAccess` and `noImplicitOverride`
   - Use absolute imports with path aliases: `@/components/*` and `@/lib/*`
   - Target ES2022 with modern features

2. **React/Next.js Conventions**
   - Use App Router (not Pages Router)
   - Prefer functional components with TypeScript
   - Use `type` imports for type-only imports: `import type { ReactNode } from 'react'`
   - Server Components by default, use `'use client'` only when necessary

3. **File Naming**
   - React components: PascalCase (e.g., `LoginForm.tsx`)
   - Pages: lowercase (e.g., `page.tsx`, `layout.tsx`)
   - Utilities/libs: camelCase

4. **Component Structure**
   - Keep components small and focused (SRP)
   - Use composition over inheritance
   - Extract reusable components to `src/components/`
   - Group related components in subdirectories

### Authentication Flow

- Simple cookie-based auth using `demo_user` cookie
- Middleware protects `/dashboard/*` routes
- Login redirects with `from` parameter for post-auth navigation
- Replace with proper auth provider (NextAuth, etc.) for production

### Testing Strategy

1. **E2E Testing with Playwright**
   - Tests located in `tests/` directory
   - Covers happy path authentication flow
   - Run with `npm run test:e2e`
   - UI mode available: `npm run test:e2e:ui`

2. **Test Writing Guidelines**
   - Focus on user journeys, not implementation details
   - Use data-testid attributes for reliable selectors
   - Test critical paths and error scenarios
   - Keep tests independent and atomic

### Development Workflow

1. **Available Scripts**
   - `npm run dev` - Development server (port 3000)
   - `npm run build` - Production build
   - `npm run lint` - ESLint with Next.js config
   - `npm run format` - Prettier formatting
   - `npm run typecheck` - TypeScript checking
   - `npm run test:e2e` - Playwright tests

2. **Docker Development**
   - Use `docker compose up -d dev` for containerized development
   - VS Code Dev Container support included

### Code Quality Standards

1. **DRY (Don't Repeat Yourself)**
   - Extract common logic into utilities
   - Create reusable components for shared UI patterns
   - Use TypeScript interfaces for shared types

2. **SOLID Principles**
   - Single Responsibility: Each component/function has one purpose
   - Open/Closed: Extend functionality through composition
   - Liskov Substitution: Use proper TypeScript types
   - Interface Segregation: Create focused interfaces
   - Dependency Inversion: Depend on abstractions, not concretions

3. **Performance Considerations**
   - Use Next.js Server Components by default
   - Implement proper loading states
   - Optimize images with Next.js Image component
   - Use dynamic imports for large components

### When Adding New Features

1. **Pages/Routes**
   - Add new routes in `src/app/` following App Router conventions
   - Use `layout.tsx` for shared layouts
   - Implement proper loading and error boundaries

2. **Components**
   - Start with Server Components, add `'use client'` only if needed
   - Create reusable components in `src/components/`
   - Use TypeScript interfaces for props
   - Keep components focused and testable

3. **API Routes**
   - Place API routes in `src/app/api/`
   - Use proper HTTP methods and status codes
   - Implement error handling
   - Add type safety for request/response

4. **Testing**
   - Add E2E tests for new user journeys
   - Update existing tests if behavior changes
   - Ensure tests run reliably in CI/CD

### Styling Guidelines

- Use semantic class names (e.g., `site-header`, `nav-link`)
- Keep global styles minimal and focused
- Consider CSS Modules or styled-components for component-specific styles
- Maintain responsive design principles

### Performance & SEO

- Use proper meta tags in layout.tsx
- Implement proper loading states
- Use Next.js built-in optimizations (Image, Link, etc.)
- Consider static generation where appropriate

## Common Patterns

### Protected Routes

Use middleware.ts pattern for route protection:

```typescript
export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has("demo_user");
  // Protection logic
}
```

### Form Handling

Create controlled components with proper TypeScript typing:

```typescript
interface FormProps {
  onSubmit: (data: FormData) => void;
}
```

### Error Boundaries

Implement error.tsx files in app directory for error handling

## Deployment Notes

- Replace demo auth with production-ready solution
- Configure proper environment variables
- Set up proper database connections
- Implement proper session management
- Add monitoring and logging

Remember: Keep changes modular, testable, and aligned with the project's focus on clean, maintainable code.
