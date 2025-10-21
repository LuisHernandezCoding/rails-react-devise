# Testing & Quality Gates

This document outlines recommended tests and CI gates for the template.

## Backend (Rails)

- Use RSpec for unit/request tests.
- Add a `spec/requests/auth_spec.rb` to validate registration/login flows.
- Add model specs for validations and relationships.
- Use `factory_bot` and `faker` for test data.

Example RSpec setup:

```ruby
# spec/rails_helper.rb
require 'factory_bot_rails'
RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end
```

Example test for registration:

```ruby
# spec/requests/auth_spec.rb
require 'rails_helper'

RSpec.describe 'Auth', type: :request do
  it 'registers a user' do
    post '/api/v1/users', params: { user: { email: 'a@b.com', password: 'password', password_confirmation: 'password' } }
    expect(response).to have_http_status(:created)
  end
end
```

## Frontend

- Use Vitest + React Testing Library (tests in this repo use Vitest globals)
- Use `msw` to mock API requests in tests
- Add tests for AuthContext and login flow

Example test:

```js
// src/__tests__/login.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider } from '../contexts/AuthContext'
import Login from '../pages/Login'

test('renders login and calls api', async () => {
  render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  )
  // ... test implementation
})
```

## CI / Quality Gates

- Run `bundle exec rubocop` and `pnpm lint`
- Run backend test suite (RSpec)
-- Run frontend tests (Vitest)
- Fail CI on lint/test failures

## Coverage

- Use SimpleCov for Rails to track test coverage
-- Use coverage reporters for frontend (vitest --coverage)

## Local quick checks

- `bundle exec rspec --fail-fast`
-- `pnpm --filter frontend test` or `pnpm --filter frontend run test:ci` for CI runs
