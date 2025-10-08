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
- [ ] Add `dotenv-rails` gem to load `.env` automatically in development and test
- [ ] Add backend to docker-compose as `backend` service
 - [x] Add `dotenv-rails` gem to load `.env` automatically in development and test
 - [x] Add backend to docker-compose as `backend` service


## 3. Backend — testing & linting

- [ ] Add RSpec and test helpers
  - add gem `rspec-rails`, run `bin/rails generate rspec:install`
- [ ] Add FactoryBot and Faker gems; create factories
- [ ] Add SimpleCov for coverage
- [ ] Add RuboCop configuration and run linting

## 4. Backend — authentication (Devise)

- [ ] Decide token vs cookie strategy (recommend: JWT for SPA)
- [ ] Add Devise and devise-jwt (or devise_token_auth) gems
- [ ] Run `bin/rails generate devise:install` and `bin/rails generate devise User`
- [ ] Add API controllers for registration and sessions under `app/controllers/api/v1`
- [ ] Add `GET /api/v1/me` endpoint
- [ ] Add tests for registration/login

## 5. Backend — background jobs & mail

- [ ] Add Redis & Sidekiq, and add `sidekiq` to `docker-compose.yml`
- [ ] Configure mailer (SendGrid/Postmark) and add envs
- [ ] Move mail sending to background jobs

## 6. Frontend (React) — initial

- [ ] Setup frontend project (Vite + TS recommended): `pnpm create vite@latest frontend --template react-ts`
- [ ] Install deps: `pnpm install`
- [ ] Add `src/contexts/AuthContext.tsx` and `src/services/api.ts`
- [ ] Add login/register pages and a protected `/dashboard` route
- [ ] Start frontend: `cd frontend && pnpm dev`

## 7. Frontend — testing & tooling

- [ ] Add Jest + React Testing Library
- [ ] Add MSW to mock API calls in tests
- [ ] Add ESLint + Prettier config and run autofix

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
