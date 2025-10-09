import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders sign in link', () => {
  render(<App />)
  expect(screen.getByText(/Sign in/i)).toBeInTheDocument()
})
