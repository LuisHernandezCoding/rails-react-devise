# Implementation Checklist — Step-by-step actionable tasks

This checklist translates the high-level "Next Steps" into an ordered, actionable list you can use while implementing and shipping the app. Mark items as you complete them.

Legend

- [ ] Not started
- [~] In progress
- [x] Done

## 0. Repository & local setup

- [x] Ensure Docker is installed and running
- [x] Create a private `.env` at repo root from `.env.example` and set correct secrets 
- [x] Confirm Node and Ruby versions (`node -v`, `ruby -v`)

## 1. Docker & Postgres

- [x] Start Postgres with Docker Compose
  - `docker compose up -d db`
  - Confirm health: `docker compose ps` and `docker compose logs db --tail=50`
- [x] Update `.env` DB host/port if needed

## 2. Backend (Rails) — initial

- [x] Install backend gems: `cd backend && bundle install`
- [x] Create `.env` in `backend/` if using host Ruby (we included a sample)
- [x] Create and migrate DB: `cd backend && bin/rails db:create db:migrate`
- [x] Seed development data: `cd backend && bin/rails db:seed`
- [x] Start backend server (host): `cd backend && bin/rails s -p 3001`
- [x] Add `dotenv-rails` gem to load `.env` automatically in development and test
- [x] Add backend to docker-compose as `backend` service

## 3. Backend — testing & linting

- [x] Add RSpec and test helpers
  - added `rspec-rails` (RSpec 3.13), created `.rspec`, `spec/spec_helper.rb`, and `spec/rails_helper.rb`
- [x] Add FactoryBot and Faker gems; create factories
  - added `factory_bot_rails` and `faker` and `spec/support/factory_bot.rb`
- [x] Add SimpleCov for coverage
  - added `simplecov` and configured `spec/spec_helper.rb` to start coverage when `SIMPLECOV` or `COVERAGE` is set
- [x] Add RuboCop configuration and run linting
  - added `rubocop` to Gemfile and a minimal `.rubocop.yml` in `backend/`; run `bundle exec rubocop -v` to verify installation
- [x] Add CI configuration for automated testing
  - added GitHub Actions workflow `.github/workflows/ci.yml` that runs backend RSpec and RuboCop and optional frontend tests
- [x] Add Gems for rubocop, and rubocop-spec
- [x] Add brakeman for security linting

Notes: RSpec and RuboCop were installed via Bundler (rspec 3.13, rubocop 1.81.1). Run `bundle exec rspec` to run tests and `bundle exec rubocop` to lint.

## 4. Backend — authentication (Devise)

- [x] Decide token vs cookie strategy (recommend: JWT for SPA)
- [x] Add Devise and devise-jwt (or devise_token_auth) gems
- [x] Run `bin/rails generate devise:install` and `bin/rails generate devise User`
- [x] Add API controllers for registration and sessions under `app/controllers/api/v1`
- [x] Add `GET /api/v1/me` endpoint
- [x] Add tests for registration/login

## 5. Backend — background jobs & mail
 
- [x] Add Redis & Sidekiq, and add `sidekiq` to `docker-compose.yml`
  - Added `redis` and `sidekiq` services to root `docker-compose.yml`.
  - Added `sidekiq` and `redis` gems to `backend/Gemfile` and a basic `config/sidekiq.yml`.
- [x] Configure mailer (SendGrid/Postmark) and add envs
  - Configured `ActionMailer` SMTP settings in `config/environments/production.rb` and development to read from `SMTP_*` env vars.
- [x] Move mail sending to background jobs
  - Configured `ActiveJob` to use `:sidekiq` in development and production. Use `deliver_later` to enqueue mail deliveries into the `mailers` queue.

## 6. Frontend (React) — initial

- [x] Setup frontend project (Vite + TS recommended): `pnpm create vite@latest frontend --template react-ts`
- [x] Install deps: `pnpm install`
- [x] Add `src/contexts/AuthContext.tsx` and `src/services/api.ts`
- [x] Add login/register pages and a protected `/dashboard` route
- [x] Start frontend: `cd frontend && pnpm dev`
- [x] Dockerize frontend project

## 7. Frontend — testing & tooling

- [x] Add Jest + React Testing Library
- [x] Add MSW to mock API calls in tests
- [x] Add ESLint + Prettier config and run autofix

## 8. CI / GitHub Actions

- [x] Add `.github/workflows/ci.yml` to run backend and frontend tests
- [x] Add caching for bundler and node modules (implemented in workflow)
- [x] Add security checks: `bundle audit` or Dependabot

Notes: Added workflow at `.github/workflows/ci.yml` which runs backend RSpec and RuboCop and frontend pnpm tests. Caching for bundler and pnpm is enabled. Added Dependabot config at `.github/dependabot.yml` to keep dependencies up to date weekly.

## 9. Dockerize full stack (optional but recommended)

- [x] Add `backend/Dockerfile` and `web` service to `docker-compose.yml`
- [x] Add `frontend` service (optional) to serve dev env
- [x] Ensure volumes are configured for code sync
- [x] Make `docker compose up` bring up db, web, and frontend for local dev

## 10. Security & production readiness

- [x] Configure HTTPS and secure cookies
  - Added `backend/config/initializers/session_store.rb` to enforce `Secure`, `HttpOnly`, and `SameSite` cookie attributes configurable via env vars (`SESSION_COOKIE_SECURE`, `SESSION_COOKIE_SAME_SITE`, `SESSION_COOKIE_KEY`). Default is `SameSite=None` in production to support cross-origin SPA setups and `lax` in development.

- [x] Add Sentry or Rollbar for error reporting
  - Added `sentry-ruby` and `sentry-rails` gems and a safe initializer at `backend/config/initializers/sentry.rb`. Sentry is enabled when `SENTRY_DSN` is set; otherwise it's a no-op.

- [x] Configure database backups and secrets management (partial)
  - Added a simple rake task `bin/rails db:backup` (implemented in `backend/lib/tasks/backup.rake`) which uses `pg_dump` to create timestamped backups in `tmp/backups/`. This is a lightweight developer convenience; for production use a managed backup solution is recommended.
  - Secrets management: continue to use encrypted Rails credentials or external secret stores (Vault/GCP Secret Manager/GitHub Secrets). Do not commit secrets to the repo.

- [x] Run dependency vulnerability scanning
  - Added `bundler-audit` (development) and ran `bundle exec bundler-audit check --update` — no known vulnerabilities were reported at scan time.

## 11. Deployment

- [x] Prepare a production `DATABASE_URL` and other envs
  - Added example production envs to root `.env.example` (DATABASE_URL, SECRET_KEY_BASE, RAILS_ENV, SMTP_*). Do NOT commit secrets.
- [x] Configure build & release pipelines (Heroku/Fly/Render/Vercel)
  - Added a sample GitHub Actions workflow at `.github/workflows/deploy.yml` which builds frontend, copies into `backend/public`, and precompiles assets. Replace the final deploy step with provider-specific commands and secrets.
- [x] Precompile assets if serving frontend from Rails
  - Added Rake task `assets:build_frontend` at `backend/lib/tasks/assets.rake` which runs `pnpm build` and copies the output to `backend/public`. Also used by the sample deploy workflow.
- [ ] Monitor health & set up alerts
  - Recommend configuring Sentry (already present) and external monitoring; left as manual step.

## 12. Release & PR checklist (for each release)

- [x] All tests pass and coverage meets threshold (verified: `bundle exec rspec` passed locally; enable `COVERAGE=1` to generate coverage report)
- [x] Security scans pass (`bundle exec bundler-audit check --update` & `bundle exec brakeman` ran clean)
- [x] Migrations reviewed and pre-tested on staging (follow `docs/release-and-rollback.md` for the workflow)
- [x] Rollout plan and rollback steps documented (`docs/release-and-rollback.md`)

## 13. Nice-to-have / later

- [ ] Add social login (OAuth) providers
- [ ] Add multi-tenancy support
- [ ] Add analytics and feature flags
