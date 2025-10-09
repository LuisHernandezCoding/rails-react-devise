## rails-react-devise — Rails + React starter with Devise auth

This repository is a bootstarter template that combines an API-only Rails backend with a modern React frontend and Devise-based authentication. It's intended to give you a working starting point with sensible defaults (Devise, Sidekiq, RSpec, Vite + React, Docker support) and a clear path to production.

This README consolidates the implementation checklist and next-steps guidance found in `docs/` so you have one authoritative entrypoint for onboarding, local development, testing, CI, and deployment.

## Table of contents

- Project overview
- Quick links
- Requirements & recommended tools
- Fast local quickstart (hosted Rails)
- Dockerized quickstart
- Authentication strategies (Devise)
- Project layout
- Testing and quality gates
- CI / GitHub Actions
- Deployment guidance
- Security & production readiness
- Useful commands & troubleshooting
- Where to find more details (docs/)

---

## Project overview

- Backend: Rails API (in `backend/`) with Devise for authentication. Sidekiq + Redis configured for background jobs. RSpec for tests.
- Frontend: React (Vite + TypeScript) in `frontend/` with a simple auth context and API service patterns.
- Docker: `docker-compose.yml` provides services for Postgres (and optional Redis/Sidekiq) to make local dev reproducible.

This repo is opinionated but flexible: pick token (JWT) or cookie-based authentication depending on your deployment topology.

## Quick links

- Implementation checklist: `docs/implementation-checklist.md`
- Detailed next steps: `docs/next-steps.md`
- Docs folder: `docs/`

## Requirements & recommended tools

- Git
- Ruby 3.2+ (use rbenv/asdf/rvm to manage versions)
- Bundler
- Node.js 18+ and pnpm (or npm/yarn)
- Docker & Docker Compose (recommended)
- PostgreSQL (containerized via Docker Compose or local install)

macOS example (Homebrew):

```bash
# Install dev tools (example)
brew install rbenv ruby-build postgresql node pnpm

# Start Postgres if using host install
brew services start postgresql
```

---

## Fast local quickstart (host Rails, Docker Postgres)

This is the fastest way to get the app running for development while keeping Rails on the host (useful for quick iteration with your editor/IDE).

1) Copy env example and set secrets

```bash
cp .env.example .env
# edit .env as needed (ports, keys)
```

2) Start Postgres with Docker Compose

```bash
docker compose up -d db
docker compose ps
docker compose logs db --tail=50
```

3) Backend setup (host Ruby)

```bash
cd backend
bundle install
./bin/rails db:create db:migrate db:seed
```

4) Start backend server

```bash
./bin/rails server -p 3001
```

5) Frontend setup & start

```bash
cd ../frontend
pnpm install
pnpm dev
```

Open the frontend (default Vite port is 5173) and exercise the auth flows.

Notes
- If Rails runs on host and frontend is in Docker, use `VITE_API_BASE=http://host.docker.internal:3001` for macOS Docker Desktop.

---

## Dockerized quickstart (full stack in Compose)

This runs everything in containers and is recommended when you want parity with production.

1) Build and start services

```bash
docker compose up --build
```

2) Run Rails migrations inside the web container

```bash
docker compose run --rm web bin/rails db:create db:migrate db:seed
```

3) Access services

- Backend: http://localhost:3001 (mapped host port)
- Frontend: http://localhost:5173 (or configured FRONTEND_PORT)

See `docs/docker.md` for more details on configuring services and ports.

---

## Authentication strategies (Devise)

Two patterns are supported and documented. Choose based on your SPA setup and security needs.

1) Cookie-based (session)
- Pros: Leverages Devise session management and Rails CSRF protections.
- Cons: More complex cross-origin setup; requires correct SameSite, Secure flags, and CORS with credentials.
- Frontend: Use fetch/axios with credentials: 'include'. Configure `rack-cors` accordingly.

2) Token-based (recommended for SPAs)
- Pros: Simpler cross-origin behavior. Use `devise-jwt` or `devise_token_auth` to issue tokens on login.
- Cons: Requires safe token storage (in memory is safest; localStorage has XSS risk). Consider refresh tokens.

Devise + devise-jwt setup notes

- Add gems: `devise`, `devise-jwt` and configure `config/initializers/devise.rb` with a JWT secret coming from env or credentials.
- Create API controllers under `app/controllers/api/v1/` for registration and sessions that return JSON with token.
- Protect endpoints with `before_action :authenticate_user!`.

Cookie config hints

- `backend/config/initializers/session_store.rb` exposes `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_SAME_SITE`, and `SESSION_COOKIE_KEY` envs to tune settings.
- For cross-origin cookies, `SameSite=None` and `Secure=true` are typically required (HTTPS).

See `docs/authentication.md` for full examples and code snippets.

---

## Project layout

- backend/ — Rails API app
  - app/
  - config/
  - db/
  - Gemfile
- frontend/ — Vite + React app
  - src/
  - package.json
  - vite.config.ts
- docs/ — extended documentation and checklists (implementation-checklist.md, next-steps.md, etc.)

---

## Tests and quality gates

Backend
- RSpec is configured. Run tests:

```bash
cd backend
bundle exec rspec
```

- SimpleCov is available for coverage when `SIMPLECOV` or `COVERAGE` is set in the environment.
- Use `factory_bot_rails` and `faker` for factories.

Frontend
- Jest + React Testing Library are included. Run:

```bash
cd frontend
pnpm test
```

Linters & security
- RuboCop for Ruby linting: `bundle exec rubocop`
- ESLint for frontend
- Brakeman and bundler-audit for dependency & security scans

CI
- A GitHub Actions workflow exists at `.github/workflows/ci.yml` that runs backend tests, RuboCop, and optional frontend tests. See `docs/ci.md` for details and how to tweak caching for bundler/pnpm.

---

## Deployment guidance

- You can deploy backend and frontend separately or serve static frontend assets from Rails `public/`.
- For serving frontend from Rails, use the provided rake task `assets:build_frontend` (see `backend/lib/tasks/assets.rake`) to build the frontend and copy files into `backend/public` before precompiling assets.
- Example providers: Heroku, Fly.io, Render, Vercel (frontend only).

Precompile assets (if serving frontend from Rails):

```bash
cd backend
bin/rails assets:precompile
```

See `docs/deployment.md` and `docs/deployment-implementation.md` for provider-specific tips and CI deployment examples.

---

## Security & production readiness

- Enforce HTTPS in production: `config.force_ssl = true` is set in production config.
- Use Rails encrypted credentials or a secrets manager for production secrets (do not commit keys).
- Configure Sentry via `SENTRY_DSN` and `SENTRY_TRACES_SAMPLE_RATE` if you want error/perf tracking.
- Run `bundle exec bundler-audit check --update` and `bundle exec brakeman` to scan for vulnerabilities.
- The repo includes a convenience task `bin/rails db:backup` for developer-level backups (see `backend/lib/tasks/backup.rake`); for production use managed backups.

Cookie and session envs

- `SESSION_COOKIE_SECURE` (true/false)
- `SESSION_COOKIE_SAME_SITE` (`none`/`lax`/`strict`)
- `SESSION_COOKIE_KEY` (cookie name)

---

## Useful commands & troubleshooting

Start Postgres via Docker Compose

```bash
docker compose up -d db
```

Run migrations (host Ruby)

```bash
cd backend
./bin/rails db:create db:migrate
```

Run migrations (container)

```bash
docker compose run --rm web bin/rails db:create db:migrate
```

Run tests

```bash
# backend
cd backend && bundle exec rspec

# frontend
cd frontend && pnpm test
```

Basic troubleshooting
- Devise login fails: check cookie SameSite/Secure and CORS (see `backend/config/initializers/cors.rb`).
- DB errors: ensure Postgres is running and `DATABASE_URL` or DB envs are correct.

---

## Where to find more details

The `docs/` folder contains expanded guidance and step-by-step checklists. Start here:

- `docs/implementation-checklist.md` — practical checklist to mark progress while implementing features
- `docs/next-steps.md` — a comprehensive, end-to-end plan with examples and commands
- `docs/authentication.md` — Devise-specific patterns and code examples
- `docs/docker.md` — Docker Compose and container notes
