import { render, screen } from '@testing-library/react'
import App from '../App'
import { AuthProvider } from '../contexts/AuthContext'

test('renders sign in link', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  )
  // The app contains multiple places that render "Sign in" (header, page
  // title, submit button). Query the header link specifically by role to
  // assert the navigation is present.
  expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument()
})
