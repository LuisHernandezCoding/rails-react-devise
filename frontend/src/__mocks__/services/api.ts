const instance: any = {
  defaults: { headers: { common: {} } },
  get: () => Promise.resolve({ data: {} }),
  post: () => Promise.resolve({ data: {} }),
}

function setToken(token: string | null) {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete instance.defaults.headers.common['Authorization']
}

export default Object.assign(instance, { setToken })
const instance = {
  defaults: { headers: { common: {} } },
  get: () => Promise.resolve({ data: {} }),
  post: () => Promise.resolve({ data: {} }),
}

function setToken(token) {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete instance.defaults.headers.common['Authorization']
}

module.exports = Object.assign(instance, { setToken })
