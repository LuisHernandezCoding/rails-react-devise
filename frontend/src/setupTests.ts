import '@testing-library/jest-dom';
// Load JS test polyfills (avoids TypeScript compile-time errors for the shims)
import './testPolyfills/setupPolyfills'
import { server } from './mocks/server'

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())
