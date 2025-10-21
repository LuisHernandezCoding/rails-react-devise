export const ctx = {
  status: (code: number) => ({ type: 'status' as const, code }),
  json: <T>(body: T) => ({ type: 'json' as const, body }),
}

type Handler = (...args: unknown[]) => unknown

export const http = {
  get: (path: string, handler: Handler) => ({ method: 'GET', path, handler }),
  post: (path: string, handler: Handler) => ({ method: 'POST', path, handler }),
}
