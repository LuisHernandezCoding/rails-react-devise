# Security Checklist & Best Practices

This document lists security practices to adopt while using this template.

## Transport

- Use HTTPS everywhere in production
- Redirect HTTP to HTTPS

## Secrets

- Store secrets in environment variables or secret managers
- Do not commit credentials to git
- Use Rails credentials or HashiCorp Vault for secrets

## Authentication & Authorization

- Use short-lived access tokens with refresh tokens where possible
- Protect endpoints with Pundit/CanCan
- Rate-limit auth endpoints to prevent brute force

## Cookies & CSRF

- Use `SameSite` and `Secure` cookie attributes
- For cross-site, use `SameSite=None; Secure` and HTTPS
- Ensure CSRF protection is enabled for cookie-session flows

## Input validation

- Validate and sanitize user input on server
- Use strong params in Rails controllers

## Dependencies

- Regularly update gems and npm packages
- Use Dependabot or similar to track vulnerabilities

## Logging & Monitoring

- Avoid logging sensitive data (passwords, tokens)
- Monitor for suspicious login attempts

## Data protection

- Encrypt sensitive columns if needed
- Use database backups and rotate keys carefully
