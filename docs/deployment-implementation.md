# Deployment implementation notes

This file documents the small changes I made to help complete the repository's "Deployment" checklist items and how to use them locally and in CI. It explains the added files, how to build and deploy the app (locally), and recommended next steps.

## What changed

- Added example production environment variables to the repository root: `.env.example`.
  - Key entries: `DATABASE_URL`, `SECRET_KEY_BASE`, `RAILS_ENV=production`, `SMTP_*` placeholders, `REDIS_URL`.

- Added a Rake task to build and copy frontend assets into the Rails `public/` folder:
  - `backend/lib/tasks/assets.rake`
  - Task: `assets:build_frontend` — runs `pnpm install --frozen-lockfile`, `pnpm build` in `frontend/`, then copies `frontend/dist/` into `backend/public/`.

- Added a sample GitHub Actions workflow as a deploy template:
  - `.github/workflows/deploy.yml`
  - The job builds the frontend, installs backend gems, copies frontend `dist/` into `backend/public`, precompiles assets, and includes a placeholder step where provider-specific deploy commands should be added.

- Small frontend TypeScript fixes so `pnpm build` can run (imports and handler typing). Files touched in `frontend/src` are minor import/type adjustments.

## How to build locally and copy assets into Rails

1) From the repository root, install frontend dependencies and build:

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm build
```

2) Use the Rails rake task to build frontend and copy into `backend/public` (this will also run the frontend build):

```bash
cd backend
bin/rails assets:build_frontend
```

Notes:
- The rake task requires `pnpm` to be installed on the runner. It will raise an error if `pnpm` is missing.
- The rake task currently clears `backend/public/*` before copying the frontend build. If you want to preserve other files in `public/` (uploads, other static files), modify the task to copy to a subdirectory (for example `public/spa`) or adjust the delete logic.

## Using the GitHub Actions deploy template

The sample workflow at `.github/workflows/deploy.yml` performs these steps:

- Installs Node and pnpm, installs frontend deps, and builds the frontend.
- Sets up Ruby, installs backend gems.
- Copies `frontend/dist/` to `backend/public/`.
- Runs `bundle exec rake assets:precompile` with `RAILS_ENV=production`.
- A final placeholder step shows where to add provider-specific deploy commands (Heroku, Fly, Render, Docker registry push, etc.).

To make this deploy workflow operational:

1. Pick a deployment target (Heroku, Fly, Render, Docker registry, etc.).
2. Add the required secrets to your GitHub repository (for example, `HEROKU_API_KEY`, `FLY_API_TOKEN`, `DATABASE_URL`, `SECRET_KEY_BASE`, `SMTP_*`, etc.).
3. Replace the placeholder step in `.github/workflows/deploy.yml` with provider-specific commands or actions. For example:

- Heroku (example): log in using `heroku` CLI and push the build.
- Fly: use the `superfly/flyctl-action` and `FLY_API_TOKEN`.
- Docker: build an image, push to a registry (GHCR, Docker Hub), and deploy.

## Production considerations and next steps

- Database: create a production Postgres instance and set `DATABASE_URL` in your host or provider secrets.
- Secrets: set `SECRET_KEY_BASE`, mailer API keys, and `DEVISE_JWT_SECRET_KEY` (if using JWT) in the provider's secret store.
- Background jobs: ensure `REDIS_URL` and Sidekiq/worker processes are configured and started in production.
- Monitoring & alerts: configure Sentry (already initialized in the app) and add uptime/alerts via a monitoring provider.
- HTTPS & security: make sure TLS termination is configured by your provider or load balancer and secure cookie settings are correct in production.

## Troubleshooting

- If `bin/rails assets:build_frontend` fails with TypeScript errors, run:

```bash
cd frontend
pnpm build
```

Fix TypeScript errors locally (typings/imports) and re-run the rake task.

- If `pnpm` is not installed on CI, add a step to install pnpm (the sample workflow includes `npm install -g pnpm`).

## Files changed/added

- `.env.example` — production env examples added
- `backend/lib/tasks/assets.rake` — new rake task for building frontend and copying assets
- `.github/workflows/deploy.yml` — sample deploy workflow
- `frontend/src/*` — small TypeScript import/type fixes
