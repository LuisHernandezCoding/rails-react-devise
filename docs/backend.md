# Backend (Rails) — Responsibilities and Guidelines

This document explains what the backend should provide and how to structure the Rails API for this template.

## Goals

- Provide a secure, versioned JSON API for the frontend.
- Handle authentication, authorization, and user management (via Devise).
- Validate and persist data.
- Send emails (confirmation, password reset) via background jobs.
- Provide robust tests and CI coverage.

## Recommended Gems

- `rails` (latest)
- `pg` (PostgreSQL)
- `devise` (authentication)
- `devise-jwt` or `devise_token_auth` (token-based API flows)
- `pundit` or `cancancan` (authorization)
- `rack-cors` (CORS handling)
- `active_model_serializers` or `fast_jsonapi` (serialization)
- `sidekiq` (background jobs)
- `rspec-rails`, `factory_bot_rails`, `faker` (testing)
- `rubocop` (linting)

## App layout suggestions

- app/controllers/api/v1 — Namespaced API controllers
- app/serializers — JSON serializers
- app/policies — Pundit policies
- app/jobs — Background jobs
- app/mailers — Mailers
- config/initializers/devise.rb — Devise config
- config/initializers/cors.rb — CORS config

## Authentication

- Prefer token-based (JWT or token auth) for single-page apps.
- If using cookie sessions, ensure CSRF tokens are provided and frontend sends credentials.

## CORS

- Allow only the frontend origins in production.
- In development use `127.0.0.1:5173` (Vite default) or `localhost:3000`.

Example `config/initializers/cors.rb`:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173'
    resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head], credentials: true
  end
end
```

## JSON API versioning

- Namespace controllers under `/api/v1/`.
- When changing responses, create `/api/v2/` and keep the old version for backwards compatibility.

## Mail delivery

- Configure Action Mailer for environment-based providers (SMTP, SendGrid, etc.)
- Use background jobs (Sidekiq) for sending emails

## Testing

- Use RSpec for request/controller/model tests.
- Add factories with `factory_bot` and use `database_cleaner` patterns if needed.

## Example endpoints

- POST /api/v1/users — register
- POST /api/v1/session — login (or use Devise defaults)
- GET /api/v1/me — current user
- POST /api/v1/logout — logout

## Observability & logging

- Use structured logging (lograge) in production
- Expose health-check endpoints
- Configure Sentry or similar for error monitoring
