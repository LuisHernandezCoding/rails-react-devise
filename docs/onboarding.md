# Onboarding — First-time setup and 1-hour plan

This checklist helps a new developer get the template running and understand key parts of the app.

## 0. Prerequisites

- Install Ruby (rbenv/asdf)
- Install Node (pnpm recommended)
- Install Postgres
- Install Bundler and Yarn/PNPM

## 1. Clone & start (15 minutes)

```bash
git clone <repo-url> my-app
cd my-app
# Backend
cd backend
bundle install
rails db:create db:migrate
rails db:seed
rails server -p 3001

# Frontend (new terminal)
cd ../frontend
pnpm install
pnpm dev
```

## 2. Create test user (5 minutes)

```bash
cd backend
rails console
User.create!(email: 'test@example.com', password: 'password', password_confirmation: 'password')
```

## 3. Explore code (20 minutes)

- Backend: Look at `app/controllers/api/v1` and `app/models/user`
- Frontend: Inspect `src/contexts/AuthContext.tsx` and `src/services/api.ts`
- Devise config: `config/initializers/devise.rb`

## 4. Add a protected page (10 minutes)

- Frontend: Create a new route `/dashboard` that fetches `/api/v1/me`
- Backend: Ensure `/api/v1/me` returns the current user when authenticated

## 5. Write a tiny test (10 minutes)

- Backend: Add request spec to assert `/api/v1/me` returns 200 when authenticated
- Frontend: Add one RTL test that renders login form and calls mocked API

## Helpful tips

- If CORS errors appear, check `config/initializers/cors.rb` and your frontend dev server origin.
- Use `rails logs` to inspect backend requests and errors
