import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { api, setToken as setApiToken } from '../services/api'

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

  async function login(email: string, password: string) {
    const res = await api.post('/api/v1/sessions', { email, password })
    const resToken = res.data.token
    const resUser = res.data.user
    setToken(resToken)
    setUser(resUser)
    setApiToken(resToken)
    localStorage.setItem('token', resToken)
  }

  async function register(email: string, password: string) {
    const res = await api.post('/api/v1/registrations', { email, password })
    const resToken = res.data.token
    const resUser = res.data.user
    setToken(resToken)
    setUser(resUser)
    setApiToken(resToken)
    localStorage.setItem('token', resToken)
  }

  function logout() {
    setUser(null)
    setToken(null)
    setApiToken(null)
    localStorage.removeItem('token')
  }

  const value: AuthContextType = { user, token, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
