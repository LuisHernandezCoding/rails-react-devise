# Frontend (React) — Responsibilities and Guidelines

This document outlines recommended frontend architecture, auth patterns, and interactions with the Rails API.

## Goals

- Provide a responsive SPA for users
- Manage auth state and protected routes
- Handle API errors and retries gracefully
- Use component-level and integration tests

## Tooling recommendations

- React (latest)
- Vite for build/dev server (fast hot reload)
- TypeScript (recommended)
- React Router for routing
- React Query or SWR for data fetching and caching
- Axios or Fetch for HTTP requests
- ESLint + Prettier for linting/formatting
- Jest + React Testing Library for tests

## Project layout

- src/
  - components/
  - pages/
  - routes/
  - services/api.ts — Axios or fetch wrapper
  - contexts/AuthContext.tsx — Auth provider
  - hooks/ — custom hooks (useAuth, useApi)
  - utils/

## Auth flow patterns

1) Token-based (recommended)
   - On login, receive JWT/access token and optional refresh token
   - Store tokens in memory and refresh when needed, or use httpOnly cookies with secure flags
   - Attach Authorization header to API requests

2) Cookie + CSRF (if Rails session cookies)
   - Ensure `fetch` or Axios sends credentials (credentials: 'include')
   - Retrieve CSRF token for unsafe requests

## Example auth context

- Provide `user`, `loading`, `login`, `logout`, and `register` methods
- Persist minimal state to localStorage only if tokens are used (careful with XSS risks)

## Protected routes

- Create a `PrivateRoute` wrapper that checks `user` and `loading` state and redirects to login

## Error handling

- Centralize 401/403 handling to trigger logout or token refresh
- Show user-friendly error messages for validation and server errors

## Tests

- Unit test components with mocked providers
- Integration test login flow with msw to mock API

## Example API wrapper (axios)

- Interceptors to attach Authorization header
- Response interceptor to handle global errors and refresh tokens

## Build & Deployment

- Use `pnpm build` (or `npm run build`) to create production assets
- Option 1: Deploy static build to Vercel/Netlify
- Option 2: Serve the built assets via Rails (copy files into Rails public/ or use rails asset pipeline)
