# Docker — Local development with Docker Compose

This doc describes how to add Docker support for local development.

## Goals

- Provide reproducible dev env with Rails, Postgres, Redis, and optional frontend
- Enable `docker-compose up` to boot services

## Recommended services

- db: Postgres
- web: Rails app
- worker: Sidekiq (optional)
- redis: Redis (for Sidekiq)
- frontend: Node/Vite (optional)

## Example docker-compose.yml (start)

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - db-data:/var/lib/postgresql/data
  redis:
    image: redis:7
  web:
    build: ./backend
    command: bash -lc "bundle exec rails db:create db:migrate && bundle exec rails s -b 0.0.0.0 -p 3000"
    volumes:
      - ./backend:/app
    ports:
      - '3001:3000'
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/postgres
    depends_on:
      - db
      - redis
  frontend:
    build: ./frontend
    command: pnpm dev --host
    volumes:
      - ./frontend:/app
    ports:
      - '5173:5173'
    depends_on:
      - web

volumes:
  db-data:
```

## Dockerfiles

- Backend Dockerfile: use Ruby base image, install node/npm for assets, bundle install, and set entrypoint
- Frontend Dockerfile: Node base, install pnpm, install deps, run dev/build

## Tips

- Use `.env` for local env vars (do not commit)
- Keep DB data in volumes for persistence
- Use `docker-compose run web rails console` for debugging
