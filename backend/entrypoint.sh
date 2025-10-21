#!/bin/bash
set -euo pipefail

# Ensure gems are installed for the current Gemfile.lock. In development we often mount the
# app directory over the image which can change the Gemfile/Gemfile.lock after the image was built.
# Try to use installed gems if possible, otherwise install into vendor/bundle so the container can
# reuse them across restarts when the volume is preserved.

echo "=> Checking for missing gems"
if ! bundle check >/dev/null 2>&1; then
  echo "=> Some gems are missing, running bundle install into vendor/bundle"
  bundle config set --local path 'vendor/bundle'
  bundle install --jobs=4 --retry=3
else
  echo "=> All gems are present"
fi

# Wait for the database to be ready (respect DB_HOST/DB_PORT env vars, default to db:5432)
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
echo "=> Waiting for database ${DB_HOST}:${DB_PORT} to be available"
until pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -q; do
  echo "=> database not ready yet, sleeping 1s"
  sleep 1
done

echo "=> Running pending migrations (if any)"
bin/rails db:migrate || true

# Execute the container's CMD
exec "$@"
