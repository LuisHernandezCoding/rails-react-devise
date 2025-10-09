import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import api from '../services/api'

type User = {
  id: number
  email: string
  name?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })

  useEffect(() => {
    if (token) {
      api.setToken(token)
      // optimistic fetch of current user
      api.get('/api/v1/me').then(res => setUser(res.data.user)).catch(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
      })
    }
  }, [token])

  async function login(email: string, password: string) {
    const res = await api.post('/api/v1/sessions', { email, password })
    const token = res.data.token
    const user = res.data.user
    setToken(token)
    setUser(user)
    api.setToken(token)
    localStorage.setItem('token', token)
  }

  async function register(email: string, password: string) {
    const res = await api.post('/api/v1/registrations', { email, password })
    const token = res.data.token
    const user = res.data.user
    setToken(token)
    setUser(user)
    api.setToken(token)
    localStorage.setItem('token', token)
  }

  function logout() {
    setUser(null)
    setToken(null)
    api.setToken(null)
    localStorage.removeItem('token')
  }

  const value: AuthContextType = { user, token, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
