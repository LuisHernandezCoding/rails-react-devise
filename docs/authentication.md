# Authentication & Devise — Patterns and Implementation

This doc goes deep on auth approaches and how to wire Devise for a Rails API consumed by a React SPA.

## Goals

- Securely authenticate users for SPA usage
- Minimize friction for register/login
- Support token-based flows (recommended) and cookie/session-based flows

## Devise basics

- Devise provides models and controllers for registration, sessions, confirmations, and password recovery.
- Typical Devise setup: `User` model, routes `devise_for :users`

## Approaches for SPA

1) Cookie-based session (Devise default)
   - Pros: Built-in, secure cookies, no token handling
   - Cons: CSRF required, cross-origin cookies tricky for separate frontend host

2) Token-based JWT (recommended for separate SPA)
   - Pros: Stateless, works well with CORS, easier for mobile clients
   - Cons: Token revocation and rotation complexity

### Using `devise-jwt`

- Add `devise-jwt` to issue JWTs on sign-in
- Configure `jwt` strategy in `config/initializers/devise.rb`
- Store the token on the client and send `Authorization: Bearer <token>`

### Using `devise_token_auth`

- Provides ready-to-use token auth endpoints and handles token persistence/rotation
- Good option for quick API token flows

## CSRF and cookies

- If you keep cookie sessions and host frontend on a separate origin, set `credentials: 'include'` on fetch/Axios and enable CORS with `credentials: true`.
- Set cookie attributes: `SameSite=None; Secure` for cross-site cookies on HTTPS.

## Refresh tokens

- Consider access token short TTL + refresh token to reduce exposure if a token is leaked
- Store refresh tokens in httpOnly secure cookies if possible

## Routes and endpoints

- POST /api/v1/users — sign up
- POST /api/v1/users/sign_in — sign in (Devise)
- DELETE /api/v1/users/sign_out — sign out
- GET /api/v1/me — fetch current user
- POST /api/v1/auth/refresh — refresh token

## Device and session management

- Track user sessions with device metadata
- Allow a user to revoke sessions

## Security considerations

- Use HTTPS in production
- Set cookies with Secure and httpOnly flags where appropriate
- Validate tokens server-side and check revocation lists when necessary

## Testing auth

- Add request specs for register/login/logout
- Add system tests if you serve the frontend via Rails

## Example: Devise + JWT initializer

```ruby
# config/initializers/devise.rb
Devise.setup do |config|
  # ... existing config
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.devise_jwt_secret_key!
    jwt.dispatch_requests = [['POST', %r{^/users/sign_in$}]]
    jwt.revocation_requests = [['DELETE', %r{^/users/sign_out$}]]
    jwt.expiration_time = 1.day.to_i
  end
end
```
