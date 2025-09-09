# Zatrust Quickstart

A minimal, modular Next.js (TypeScript) starter focused on:

- E2E testability (Playwright)
- DRY, SRP, SOLID principles
- Low-code patterns
- Modular structure
- Lightweight containerization

## Features

- **Landing page** (`/`) - Clean, minimal welcome page
- **Login** (`/login`) - Simple cookie-based authentication
- **Dashboard** (`/dashboard`) - Protected route with middleware
- **Docker containerization** - Both development and production ready
- **DevContainer support** - VS Code development environment
- **E2E testing** - Playwright test suite
- **TypeScript** - Full type safety
- **Professional styling** - Clean, modern UI

## Quick Start Options

### Option 1: Development with VS Code DevContainer (Recommended)
```bash
# Clone and open in VS Code
docker compose up -d dev
# Then: "Dev Containers: Reopen in Container" in VS Code
```

### Option 2: Production Deployment (One Command)
```bash
# Build and run production container
docker compose -f docker-compose.prod.yml up -d
# Visit http://localhost:3000
```

### Option 3: Local Development
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Development Scripts

- `npm run dev` – Start Next.js dev server on http://localhost:3000
- `npm run build` – Build for production
- `npm run start` – Run production build
- `npm run lint` – Lint with ESLint
- `npm run typecheck` – TypeScript type checking
- `npm run test:e2e` – Run Playwright E2E tests

## Authentication

This starter uses minimal cookie-based demo authentication to keep dependencies low. 
- Username: any value (try "demo")
- No password required
- For production: replace with NextAuth.js or your preferred IdP

## Architecture

Built following SOLID principles:
- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Easily extensible without modification
- **Liskov Substitution**: Components are interchangeable
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Abstractions over concretions

## Container Health

Production containers include health checks and can be monitored:
```bash
docker compose -f docker-compose.prod.yml ps
```

## Testing

E2E tests cover the complete user journey:
- Landing page navigation
- Authentication flow
- Protected route access
- Logout functionality

```bash
npx playwright install  # Install browsers (if needed)
npm run test:e2e        # Run tests
```

## File Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/auth/     # Authentication endpoints
│   │   ├── dashboard/    # Protected dashboard page
│   │   ├── login/        # Login page
│   │   └── page.tsx      # Landing page
│   ├── components/       # Reusable components
│   │   └── auth/         # Authentication components
│   └── middleware.ts     # Route protection
├── tests/                # E2E tests
├── .devcontainer/        # VS Code DevContainer config
├── docker-compose.yml    # Development environment
├── docker-compose.prod.yml # Production deployment
└── Dockerfile           # Production image
```

## Contributing

This project follows DRY, SRP, and SOLID principles. When making changes:
1. Keep components focused and single-purpose
2. Maintain type safety
3. Add E2E tests for new user flows
4. Update documentation
5. Test in both development and production containers
