# rails-react-devise

A starter template that combines the latest Rails API backend with a modern React frontend and Devise-based authentication (register + login). This repo is a minimal, opinionated bootstrap for building full-stack Rails + React applications with authentication, ready for expansion and deployment.

## Highlights

- Rails (latest) as API backend
- React (latest) as frontend (Vite or Create React App can be used; this template assumes a modern toolchain)
- Devise for user authentication (registration, login)
- Basic onboarding and guidance to expand features: protected routes, API tokens, social auth, testing, and deployment

## Table of contents

- Project structure
- Prerequisites
- Quick start
- Development workflow
- Authentication (Devise) overview
- Onboarding guide: first 30 minutes
- Expanding the template (features to add)
- Tests and quality gates
- Deployment
- Troubleshooting
- Contributing

## Project structure

This repository is intentionally minimal. Typical layout for a Rails API + React app looks like:

- /backend or / (Rails app)
	- app/
	- config/
	- db/
	- Gemfile
- /frontend or / (React app)
	- package.json
	- src/
	- vite.config.js or craco/webpack config
- README.md

Note: This template doesn't lock you into a specific monorepo layout. Choose either a monorepo (both apps in one repo) or two repos (recommended if teams separate frontend/backend).

## Prerequisites

- macOS / Linux / Windows WSL
- Ruby (3.2+ recommended) and Bundler
- Node.js (18+ recommended) and npm/yarn/pnpm
- PostgreSQL (recommended), or SQLite for local/dev
- Git

Install system tools (example macOS using Homebrew):

```bash
# Ruby + tools
brew install rbenv ruby-build postgresql node pnpm

# Start Postgres
brew services start postgresql
```

## Quick start

This quickstart assumes a monorepo with `backend/` (Rails API) and `frontend/` (React). Adjust paths if you keep a single-app layout.

1) Install backend gems and create the database

```bash
cd backend
bundle install
rails db:create db:migrate
```

2) Install frontend packages

```bash
cd ../frontend
pnpm install   # or npm install / yarn install
```

3) Run both servers in development (two terminals)

Terminal 1 (Rails API):

```bash
cd backend
rails server -p 3001
```

Terminal 2 (React frontend):

```bash
cd frontend
pnpm dev   # or npm run start
```

Open your browser at http://localhost:5173 (or port your frontend dev server uses) and the React app will proxy API requests to the Rails backend.

## Development workflow

- Backend: Use Rails API mode (controllers under app/controllers/api). Add serializers (ActiveModelSerializers, FastJsonapi, or Blueprinter) for JSON responses.
- Frontend: Use React with functional components and hooks. Keep auth state in context or a global store (React Context, Redux, Zustand).
- CORS & CSRF: For API-only Rails apps, configure CORS (rack-cors) and consider token-based auth for SPAs. Devise supports session-based auth but for SPAs token or JWT flows are common.

## Authentication (Devise) overview

This template wires up Devise for user registration and login. Typical approaches for SPAs:

1) Session-based (cookies): Keep Devise sessions and protect API endpoints using standard Devise helpers. Ensure frontend uses same-site cookies and CSRF tokens.
2) Token-based (recommended for APIs): Use Devise + devise_token_auth or devise-jwt to issue access tokens. The frontend stores tokens (in memory or secure storage) and attaches Authorization header to API requests.

By default, this template includes a basic Devise setup for register/login endpoints. To switch to token/JWT flows, install `devise-jwt` or `devise_token_auth` and follow their docs.

## Onboarding guide — first 30 minutes

Follow these steps when you clone this template to get a running app fast.

1) Clone the repo

```bash
git clone <repo-url> my-app
cd my-app
```

2) Backend setup

```bash
cd backend
bundle install
rails db:create db:migrate
rails db:seed   # if seed file exists
```

If you get errors about Ruby version, use rbenv / rvm / asdf to install the specified Ruby.

3) Frontend setup

```bash
cd ../frontend
pnpm install
pnpm dev
```

4) Create a test user (via Rails console or UI)

Rails console:

```bash
cd backend
rails console
User.create!(email: 'test@example.com', password: 'password', password_confirmation: 'password')
```

5) Test the auth flow

- Use the React UI to register/login or use curl/postman to hit the API endpoints.

## Expanding the template — recommendations and features to add

Here are common next steps when turning this starter into a production-ready app:

- Use `devise-jwt` or `devise_token_auth` for token-based authentication for SPAs
- Add email confirmation and account recovery (Devise modules)
- Add user roles and authorization with Pundit or CanCanCan
- Add RSpec + FactoryBot + DatabaseCleaner for Rails tests
- Add Jest + React Testing Library for frontend tests
- Add TypeScript to the frontend for stronger types
- Add Dockerfiles and docker-compose for consistent dev environments
- Add CI (GitHub Actions) for test and lint pipelines
- Integrate a hosted DB and email provider (SendGrid/Postmark) for production

## Tests and quality gates

- Backend: RSpec recommended. Add a simple smoke test to ensure user registration works.
- Frontend: Add one integration test for login flow using React Testing Library.

Example backend test (RSpec):

```ruby
# spec/requests/auth_spec.rb
require 'rails_helper'

RSpec.describe 'Auth', type: :request do
	it 'registers a user' do
		post '/users', params: { user: { email: 'a@b.com', password: 'password', password_confirmation: 'password' } }
		expect(response).to have_http_status(:created)
	end
end
```

## Deployment

Common deployment targets:

- Heroku (easy for Rails + Postgres)
- Fly.io
- Render
- DigitalOcean App Platform

Tips:

- Precompile assets for the Rails app (if serving frontend as part of Rails): `rails assets:precompile`
- Configure environment variables: SECRET_KEY_BASE, DATABASE_URL, RAILS_ENV=production
- For separate frontend hosting, deploy the frontend as a static app (Vercel, Netlify, or static S3) and point API calls to your backend host.

## Troubleshooting

- Devise login fails: check cookie settings, CORS config, and allow credentials on CORS.
- Database errors: ensure Postgres is running and DATABASE_URL is set.
- Frontend 404s: verify your dev server port and proxy configuration.

## Contributing

Contributions are welcome. If you add core changes (different auth approach, new CI, Docker setup), try to keep the template flexible and document any non-obvious steps in this README.

## License

MIT

---

If you'd like, I can also:

- Add example `docker-compose.yml` for local development
- Add a minimal Rails `api-only` skeleton and a simple React Vite app wired to it
- Implement Devise + devise-jwt example flow and tests

Tell me which next step you'd like and I'll implement it.

## Frontend (Docker)

If you prefer running the frontend using Docker Compose, the project exposes a few environment variables to control its behavior:

- `FRONTEND_PORT` — the host port mapped to the frontend dev server (defaults to `5173`).
- `VITE_API_BASE` — the base URL the frontend will use to call your backend API. Example values:
	- `http://host.docker.internal:3001` (macOS Docker Desktop, reaches a backend bound to host port 3001)
	- `http://backend:3000` (container-to-container networking; use this when the backend runs as a compose service)

Example `.env` (project root):

```
# Expose frontend on host port 5173
FRONTEND_PORT=5173

# Point the frontend to the backend API. Choose host.docker.internal (macOS) or container networking.
VITE_API_BASE=http://host.docker.internal:3001
```

Start everything with:

```bash
docker compose up --build
```

Notes:
- The frontend container receives `PORT` and `HOST` env vars so the Vite dev server listens on `0.0.0.0` and the configured port.
- If you change `FRONTEND_PORT`, use that same value to open the frontend in your browser (e.g. `http://localhost:3000`).
- For a production-ready frontend image, consider adding a multi-stage Dockerfile that runs `pnpm build` and serves the static output with nginx (I can add this if you want).

