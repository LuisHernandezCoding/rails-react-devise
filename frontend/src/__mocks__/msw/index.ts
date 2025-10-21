export const ctx = {
  status: (code: number) => ({ type: 'status', code }),
  json: (body: any) => ({ type: 'json', body }),
}

export const http = {
  get: (path: string, handler: any) => ({ method: 'GET', path, handler }),
  post: (path: string, handler: any) => ({ method: 'POST', path, handler }),
}
