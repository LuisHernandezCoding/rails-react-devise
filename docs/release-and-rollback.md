# Release & Rollback Guide

This document contains the concrete steps to perform releases (including migrations) and rollback strategies for this Rails + React project.

Quick checklist before releasing

- Ensure all tests pass locally and in CI (`bundle exec rspec`, frontend tests). If coverage thresholds are required, run with `COVERAGE=1 bundle exec rspec` and review `coverage/` output.
- Run security scans: `bundle exec bundler-audit check --update` and `bundle exec brakeman`.
- Review pending migrations: `git diff -- db/migrate` and open PR for any migration changes.
- Create a backup of the production database before running migrations.

Release steps (recommended)

1. Create a release branch from `main` and open a PR. Have a reviewer confirm tests and scans pass in CI.
2. Tag the release (e.g., `v1.2.3`) after PR approval.
3. Deploy to staging and run migrations in a migration-only job (no web traffic):

```bash
# Example with Heroku-like flow
# Run migrations on staging
bin/rails db:migrate RAILS_ENV=staging
```

4. Run smoke checks on staging:

```bash
curl -sSf https://staging.example.com/health
curl -sSf https://staging.example.com/api/v1/me -H "Authorization: Bearer $SMOKE_TOKEN"
```

5. Deploy to production (follow provider-specific instructions). Before running migrations, create a DB backup.

Rollback strategies

- Fast rollback (code only): Roll back to previous release tag and restart web processes. This is safe if migrations are non-destructive.
- Database rollback (if migration is destructive):
  - Restore DB from the backup taken before migrations (provider UI or pg_restore). Document the exact restore command provided by your DB host.
  - If you maintain backward-compatible migrations (recommended), you can deploy the previous code that works with the current schema.

Tips

- Prefer additive migrations and deploy in two phases for destructive changes: add columns/flags, deploy, backfill, then remove legacy code/migrations.
- Automate backups and smoke tests in CI where possible.

For project-specific instructions see `docs/implementation-checklist.md` (section 12).
