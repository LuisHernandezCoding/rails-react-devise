import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || ''
})

function setToken(token: string | null) {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete instance.defaults.headers.common['Authorization']
}

export default Object.assign(instance, { setToken })
