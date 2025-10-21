import axios from 'axios'

// Use process.env in tests (Jest/Node). In Vite builds, users can set
// VITE_API_BASE via the define/plugins or environment so this still works
// in production. Prefer process.env for test friendliness.
const baseURL = (typeof process !== 'undefined' && (process.env as any).VITE_API_BASE) || ''

const instance = axios.create({
  baseURL,
})

function setToken(token: string | null) {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete instance.defaults.headers.common['Authorization']
}

export default Object.assign(instance, { setToken })
