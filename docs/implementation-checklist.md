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

- [ ] Add `.github/workflows/ci.yml` to run backend and frontend tests
- [ ] Add caching for bundler and node modules
- [ ] Add security checks: `bundle audit` or Dependabot

## 9. Dockerize full stack (optional but recommended)

- [ ] Add `backend/Dockerfile` and `web` service to `docker-compose.yml`
- [ ] Add `frontend` service (optional) to serve dev env
- [ ] Ensure volumes are configured for code sync
- [ ] Make `docker compose up` bring up db, web, and frontend for local dev

## 10. Security & production readiness

- [ ] Configure HTTPS and secure cookies
- [ ] Add Sentry or Rollbar for error reporting
- [ ] Configure database backups and secrets management
- [ ] Run dependency vulnerability scanning

## 11. Deployment

- [ ] Prepare a production `DATABASE_URL` and other envs
- [ ] Configure build & release pipelines (Heroku/Fly/Render/Vercel)
- [ ] Precompile assets if serving frontend from Rails
- [ ] Monitor health & set up alerts

## 12. Release & PR checklist (for each release)

- [ ] All tests pass and coverage meets threshold
- [ ] Security scans pass
- [ ] Migrations reviewed and pre-tested on staging
- [ ] Rollout plan and rollback steps documented

## 13. Nice-to-have / later

- [ ] Add social login (OAuth) providers
- [ ] Add multi-tenancy support
- [ ] Add analytics and feature flags
