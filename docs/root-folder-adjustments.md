# Root folder adjustments — recommended edits after cloning

This document explains what to check and adjust in the repository root after you clone this template. It focuses on the typical monorepo layout (`backend/` and `frontend/`) and suggests convenient scripts, files, and housekeeping steps to make the repository ergonomic for development, CI, and deployment.

## Goals

- Provide a small, well-documented surface at the repository root for common tasks
- Make it easy for contributors to run the app locally and run tests
- Centralize high-level scripts and tooling (Makefile, `.env.example`, `bin/` helpers)

## Files to add or adjust at the root

1. `.env.example`

- Add example environment variables for local development. Do NOT commit secrets.
- Typical entries:

```
# Postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=rails_react_devise_development
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Rails
SECRET_KEY_BASE=change_me
RAILS_ENV=development

# Frontend
VITE_API_HOST=http://localhost:3001

# Redis
REDIS_URL=redis://localhost:6379/1
```

2. `Makefile` or `justfile` (optional but useful)

- Provide shortcuts for everyday tasks. Example targets:

```
.PHONY: install backend frontend setup reset db

install:
	cd backend && bundle install
	cd frontend && pnpm install

backend:
	cd backend && rails s -p 3001

frontend:
	cd frontend && pnpm dev

setup:
	make install
	cd backend && rails db:create db:migrate db:seed

reset-db:
	cd backend && rails db:drop db:create db:migrate
```

3. `bin/dev` or `Procfile.dev`

- `bin/dev` can run both backend and frontend concurrently for local dev using tools like `foreman` or `overmind`.

Example `Procfile.dev`:

```
backend: cd backend && rails server -p 3001
frontend: cd frontend && pnpm dev
```

4. `.gitignore`

- Ensure both backend and frontend build artifacts and local env files are ignored.
- Typical entries: `node_modules/`, `vendor/bundle`, `tmp/`, `.env`, `.env.local`, `.DS_Store`

5. `README.md` at root

- Keep it up to date with quickstart and links to `/docs` for deeper instructions.

6. `LICENSE` and `CODE_OF_CONDUCT.md` (if open source)

7. `CHANGELOG.md` (optional)

## Scripts in `package.json` at root (optional)

If you prefer top-level npm scripts to run the monorepo tasks, add a `package.json` at repo root with scripts like:

```json
{
  "name": "rails-react-devise",
  "private": true,
  "scripts": {
    "install:all": "(cd backend && bundle install) && (cd frontend && pnpm install)",
    "dev:backend": "cd backend && rails s -p 3001",
    "dev:frontend": "cd frontend && pnpm dev",
    "dev": "concurrently \"pnpm run dev:frontend\" \"pnpm run dev:backend\""
  }
}
```

Note: Use `concurrently` or `npm-run-all` if you add this approach.

## Docker and root-level compose

- Add `docker-compose.yml` at repo root to orchestrate `db`, `redis`, `web`, and `frontend` services. This keeps a single command to bring up the full stack.

## CI and GitHub Actions

- Add a `.github/workflows/ci.yml` that runs both backend and frontend jobs.
- Store CI-specific envs in repository secrets, not in repo.

## Quick housekeeping checklist after cloning

- [ ] Copy `.env.example` to `.env` and set secrets locally
- [ ] Run `make setup` or `pnpm install` / `bundle install` for each app
- [ ] Start services with `make dev`, `bin/dev`, or `docker-compose up`
- [ ] Create a test user in Rails console or via the UI
- [ ] Run tests: `cd backend && bundle exec rspec` and `cd frontend && pnpm test`

## Monorepo vs Separate repos

- Monorepo (both apps in one repo) is convenient for small teams or templates. Keep clear boundaries: `backend/` and `frontend/`.
- Separate repos are useful for larger teams, independent deployments, and different release cycles.

## Example small refactors to the root

- Add `CONTRIBUTING.md` referencing `/docs/onboarding.md` and coding standards
- Add `scripts/` with helper scripts (e.g., `scripts/setup.sh`) to automate environment setup
- Add `tools/` for local dev scripts such as `scripts/seed-dev-data.rb`

## Final notes

Keep root-level changes minimal and focused on developer ergonomics. Point detailed technical docs into `/docs/` so contributors can dive deeper without scrolling through the root README.