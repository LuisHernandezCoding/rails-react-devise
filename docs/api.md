# API Design & Contract Guide

This document describes how to design consistent API endpoints for the Rails backend consumed by the React frontend.

## Principles

- Keep endpoints RESTful and resource-oriented
- Use JSON:API or a lightweight consistent response shape
- Return HTTP appropriate status codes
- Include pagination metadata for collection endpoints

## Response shape (example)

```json
{
  "data": {
    "id": 1,
    "type": "user",
    "attributes": {
      "email": "alice@example.com",
      "name": "Alice"
    }
  }
}
```

## Error responses

- Use a consistent error format:

```json
{
  "errors": [
    { "status": "422", "title": "Unprocessable Entity", "detail": "Email can't be blank" }
  ]
}
```

## Versioning

- Use path versioning: `/api/v1/` and bump to `/api/v2/` for breaking changes

## Authentication headers

- Use `Authorization: Bearer <token>` for token flows
- For cookies, ensure `credentials: 'include'` is used by client

## Pagination

- Use `page` and `per_page` query params and include meta in responses

## Rate limiting

- Add rate-limiting for public endpoints (e.g., login)

## OpenAPI / Swagger

- Maintain an OpenAPI spec for public endpoints for documentation and client generation
- Consider generating client types from the OpenAPI spec for the frontend

## Contract testing

- Use pact or contract tests to verify the API and frontend expectations
