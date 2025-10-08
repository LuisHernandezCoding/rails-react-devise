# Deployment & Production Notes

This doc covers common deployment approaches and important production configs.

## Options

- Heroku — simple, one-command deploy, Postgres add-on
- Fly.io — great for full-stack apps and databases
- Render — managed services with web + static hosting
- Vercel / Netlify — host frontend; backend on separate provider

## Environment variables

- `DATABASE_URL` — production DB connection
- `SECRET_KEY_BASE` — Rails secret
- `RAILS_ENV=production`
- Email provider keys (SENDGRID_API_KEY, etc.)
- `DEVISE_JWT_SECRET_KEY` or credentials for auth

## Serving frontend

- Option A: Deploy frontend separately (Vercel/Netlify) and set API_HOST in frontend env
- Option B: Build frontend and serve via Rails (copy build to `public/` or host through nginx)

## Database migrations

- Run migrations during deploy
- Keep backup snapshots and maintenance windows when necessary

## Background jobs

- Run Sidekiq or other job workers in production
- Configure Redis and provide `REDIS_URL`

## Logging and monitoring

- Use centralized logging (Papertrail, LogDNA)
- Use Sentry or Rollbar for error reporting

## HTTPS & security

- Ensure TLS termination (Let's Encrypt, provider-managed certs)
- Block open ports and secure admin endpoints

## Scaling tips

- Move heavy CPU work to background jobs
- Cache using Redis and HTTP caches (CDN)
- Use connection pool tuning for ActiveRecord
