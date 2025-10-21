import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { AuthProvider } from '../contexts/AuthContext'
import * as api from '../services/api'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('App', () => {
  it('renders sign in link', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument()
  })

  it('logs in a user and logs out', async () => {
    const user = { id: 1, email: 'test@example.com' }
    const postSpy = vi.spyOn(api.api, 'post').mockResolvedValue({ data: { user, token: 'test-token' } })
    const deleteSpy = vi.spyOn(api.api, 'delete').mockResolvedValue({ data: {} })
    renderWithProviders(<App />)

    await act(async () => {
      fireEvent.click(screen.getByRole('link', { name: /Sign in/i }))
    })

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } })
      fireEvent.click(screen.getByRole('button', { name: /Sign in/i }))
    })

    await screen.findByTestId('welcome-message')
    expect(screen.getByTestId('welcome-message')).toHaveTextContent(/Welcome, test@example.com/i)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Sign out/i }))
    })

    expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument()
    postSpy.mockRestore()
    deleteSpy.mockRestore()
  })
})
