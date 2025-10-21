type ApiResponse<T = unknown> = { data: T }

const instance = {
  defaults: { headers: { common: {} as Record<string, string> } },
  get: <T = unknown>() => Promise.resolve({ data: {} as T } as ApiResponse<T>),
  post: <T = unknown>() => Promise.resolve({ data: {} as T } as ApiResponse<T>),
}

function setToken(token: string | null) {
  if (token) (instance.defaults.headers.common as Record<string, string>)['Authorization'] = `Bearer ${token}`
  else delete (instance.defaults.headers.common as Record<string, string>)['Authorization']
}

export default Object.assign(instance, { setToken })
