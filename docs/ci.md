# CI/CD — Recommendations and Example GitHub Actions

This document provides a simple GitHub Actions pipeline for tests and linting.

## Goals

- Run backend and frontend tests on PRs
- Run linters
- Optionally build and deploy on merge to main

## Example workflow: `.github/workflows/ci.yml`

```yaml
name: CI

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install backend gems
        run: |
          cd backend
          bundle install --jobs 4 --retry 3
      - name: Prepare DB
        run: |
          cd backend
          cp config/database.yml.ci config/database.yml || true
          bundle exec rails db:create db:schema:load
      - name: Run RSpec
        run: |
          cd backend
          bundle exec rspec

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install deps
        run: |
          cd frontend
          pnpm install
      - name: Run frontend tests
        run: |
          cd frontend
          pnpm test -- --ci --reporters=default
```

## Deployment job

- Add a job that builds frontend assets and deploys to your hosting provider (Vercel, Netlify, or S3) and deploys backend (Heroku, Fly) using provider actions or CLI.
