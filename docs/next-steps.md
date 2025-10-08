# Next Steps — Comprehensive end-to-end guide

This document is a detailed, practical checklist and how-to for turning this template into a working, production-ready Rails + React app with Devise authentication. It's intended to be followed step-by-step. Use it as a living checklist during project bootstrapping and early development.

Table of contents

- Preparation: what we have and what you need
- Local development: quickstart and daily workflow
- Dockerized development: run everything in containers
- Backend (Rails) next steps
  - Devise integration (register/login) — overview and implementation plan
  - API design and versioning
  - Background jobs, mailers, and attachments
  - Logging, monitoring, and error tracking
- Frontend (React) next steps
  - Project structure, auth flow, and API consumption
  - UI scaffolding and protected routes
  - Build and deploy options
- Testing and quality gates
  - Backend (RSpec) and frontend (Jest/RTL)
  - Contract testing and API specs
  - CI / GitHub Actions
- Security and operational hardening
- Deployment checklists (staging and production)
- Expansion ideas and optional features
- Troubleshooting & common gotchas
- Appendix: useful commands and templates


---

Preparation: what we have and what you need

This template currently includes:

- `backend/` — API-only Rails (scaffolded)
- `docs/` — comprehensive guidance (this file is part of it)
- `docker-compose.yml` — Postgres service configured (env-driven)
- `.env.example` — environment variable examples
- Root `.gitignore` and `backend/.gitignore`

Prerequisites on your machine:

- Docker and Docker Compose (v2+)
- Ruby (if you run Rails on host) — recommended version matches `.ruby-version` in `backend/`
- Bundler
- Node and package manager (pnpm/yarn/npm) for frontend work
- Git

Decide your development model up front:

- Host Rails locally + Docker Postgres (default we used earlier). Pros: fast iterative feedback when using host Ruby/IDE. Cons: potential differences vs production.
- Containerized Rails (recommended long-term). Add a `web` service to `docker-compose.yml` and a `backend/Dockerfile` (I can scaffold these for you).


Local development: quickstart and daily workflow

Quickstart (host Rails, Docker Postgres):

1) Copy env example and edit secrets locally:

```bash
cp .env.example .env
# edit .env if needed (ports/hosts)
```

2) Start Postgres via Docker Compose:

```bash
docker compose up -d
```

3) Install backend deps and setup DB (host Ruby):

```bash
cd backend
bundle install
# ensure backend/.env exists; dotenv-rails will load it in dev
./bin/rails db:create db:migrate db:seed
```

4) Start the backend on port 3001:

```bash
./bin/rails server -p 3001
```

5) Frontend (developer choice: Vite recommended):

```bash
cd frontend
pnpm install
pnpm dev
```

Daily workflow tips

- Use `bin/rails` commands from `backend/` for migrations, console, and runners.
- Use `pnpm dev` (or `npm run dev`) for fast frontend feedback.
- Use `git` topic branches and PRs. Add a `Makefile` to centralize common tasks (see `docs/root-folder-adjustments.md`).


Dockerized development: run everything in containers

I recommend adding a `backend/Dockerfile` and a `web` service to `docker-compose.yml` so the entire stack runs with `docker compose up -d`. Essential steps:

1) Add `backend/Dockerfile` (minimal):

```dockerfile
FROM ruby:3.2
WORKDIR /app
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client
COPY backend/Gemfile backend/Gemfile.lock ./
RUN gem install bundler && bundle install
COPY backend/ ./
CMD ["bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
```

2) Add `web` to `docker-compose.yml`:

```yaml
web:
  build: ./backend
  command: bin/rails server -b 0.0.0.0 -p 3000
  volumes:
    - ./backend:/app
  ports:
    - "3001:3000"
  env_file:
    - .env
  depends_on:
    db:
      condition: service_healthy
```

3) Bring up the stack:

```bash
docker compose up --build
```

4) Run migrations inside the container:

```bash
docker compose run --rm web bin/rails db:create db:migrate
```


Backend (Rails) next steps

1) Devise integration (register/login)

Overview

- Decide session (cookie) vs token (JWT) flows. For SPAs, token-based auth (devise-jwt or devise_token_auth) is simpler cross-origin; cookies require careful CORS and SameSite configuration.

Implementation plan (JWT example)

- Add gems: `devise`, `devise-jwt`, `bcrypt`, `rack-cors`.
- Generate Devise user model and controllers:

```bash
cd backend
bin/rails generate devise:install
bin/rails generate devise User
bin/rails db:migrate
```

- Configure `devise-jwt` in `config/initializers/devise.rb` (use a secret stored in credentials or env).
- Create controllers under `app/controllers/api/v1/` for registration and sessions that return JSON and tokens.
- Add `current_user` endpoints (`GET /api/v1/me`) and protect APIs with `before_action :authenticate_user!`.

Notes for cookie-based flow

- Enable CORS with credentials in `config/initializers/cors.rb` and set `credentials: true`.
- Frontend must use `fetch/axios` with `credentials: 'include'`.

2) API design & versioning

- Namespace controllers under `app/controllers/api/v1` and return consistent JSON shapes.
- Add serializers (e.g., `fast_jsonapi` or `ActiveModel::Serializer`).
- Provide an OpenAPI spec to keep frontend/backends in sync.

3) Background jobs & mailers

- Add Sidekiq and Redis for background processing.
- Configure mailer (SendGrid/SMTP) and send emails via jobs.

4) Logging & monitoring

- Add structured logging (`lograge`) and error tracking (Sentry).
- Expose `GET /health` endpoint for readiness and liveness checks.


Frontend (React) next steps

1) Project structure & tooling

- Use Vite + TypeScript for speed & safety.
- Use React Router and React Query (or SWR) for data fetching.
- Centralize API calls in `src/services/api.ts` (axios instance with interceptors).

2) Auth flow

Token-based flow (recommended)

- On login, backend returns `{ user: {...}, token: '...' }`.
- Store token in memory or in `localStorage` (memory + refresh preferred). Avoid storing tokens in localStorage for sensitive apps unless you accept XSS risk.
- Use axios interceptor to attach `Authorization: Bearer <token>` header.

Cookie-based flow

- Use `credentials: 'include'` on fetch/axios for cross-site cookie auth.
- Retrieve CSRF tokens when necessary.

3) UI scaffolding

- AuthContext (`src/contexts/AuthContext.tsx`) provides `user, login, logout, register`.
- Private routes wrapper to guard pages.

4) Build & deploy

- Build with `pnpm build` then deploy to Vercel/Netlify for static hosting or serve assets from Rails `public/`.


Testing and quality gates

1) Backend (RSpec)

- Add `rspec-rails`, `factory_bot_rails`, and `faker`.
- Create request specs for auth endpoints and a smoke test to ensure `/api/v1/me` returns 200 when authenticated.
- Use `SimpleCov` to monitor coverage.

2) Frontend (Jest + React Testing Library)

- Test `AuthContext` flows and one integration test for login using `msw` to mock API.

3) Contract testing

- Use Pact or OpenAPI-based contract tests between frontend and backend.

4) CI (GitHub Actions)

- Run `docker compose up -d db` in CI job when needed, or use service containers. Run backend tests and frontend tests on PRs.

Example CI snippet (simplified):

```yaml
# .github/workflows/ci.yml (high-level)
jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
      - run: cd backend && bundle install && cp config/database.yml.ci config/database.yml && bundle exec rspec
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd frontend && pnpm install && pnpm test -- --ci
```


Security & operational hardening

- Enforce HTTPS in production and redirect HTTP to HTTPS.
- Use secure, managed secrets (Vault, GitHub Secrets, etc.).
- Rotate keys and never commit secrets.
- Run dependency scanning (Dependabot) and static analysis (Brakeman, bundler-audit, npm audit).
- Add rate limiting on auth-related endpoints.


Deployment checklists (staging & production)

Staging checklist

- Deploy branch to staging, run DB migrations in a migration-only job.
- Smoke-check /health and /api/v1/me endpoints.
- Validate email sending using sandbox or a test provider.

Production checklist

- Backup DB before migration
- Run migrations in a maintenance window if breaking
- Monitor errors and performance post-deploy
- Ensure CDN and caching are in front of static assets


Expansion ideas

- Social login (Omniauth providers)
- Multi-tenant support
- Background processing at scale (ActiveJob + Sidekiq + Redis)
- Multi-environment feature flags


Troubleshooting & common gotchas

- CORS issues: ensure `rack-cors` config matches frontend origin and `credentials: true` if using cookies.
- DB host mismatch: if Rails runs on the host, use `DB_HOST=127.0.0.1` mapped to the container port; if Rails runs in Docker, use `DB_HOST=db`.
- Secrets leaks: run `git secrets` and `git log --all --grep="SECRET"` if you accidentally committed.


Appendix: useful commands

Start DB (compose):

```bash
docker compose up -d db
```

Run migrations (host Ruby):

```bash
cd backend
./bin/rails db:create db:migrate
```

Run migrations (containerized):

```bash
docker compose run --rm web bin/rails db:create db:migrate
```

Run tests:

```bash
# backend
cd backend && bundle exec rspec
# frontend
cd frontend && pnpm test
```

Commit and push:

```bash
git add . && git commit -m "chore: ..." && git push
```


If you'd like, I can now implement any of the following automatically:

- Add RSpec and a sample auth request spec in `backend/`.
- Add a `web` service and `backend/Dockerfile` so the whole stack runs under Docker Compose.
- Scaffold Devise + devise-jwt example endpoints and a simple login/register flow.
- Add CI workflow to run backend and frontend tests.

Tell me which of those you want me to implement next and I'll add a short todo and start.  