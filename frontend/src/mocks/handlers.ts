import { rest } from 'msw'

// Derive the handler parameter types from `rest.get` to avoid using `any`/`unknown`.
type RestGetResolver = Parameters<typeof rest.get>[1]
type RestGetResolverParams = Parameters<RestGetResolver>
type RestRequestType = RestGetResolverParams[0]
type RestResponseComposition = RestGetResolverParams[1]
type RestContext = RestGetResolverParams[2]

export const handlers: Array<ReturnType<typeof rest.get>> = [
  rest.get('/api/v1/me', (_req: RestRequestType, res: RestResponseComposition, ctx: RestContext) => {
    return res(ctx.status(200), ctx.json({ id: 1, email: 'test@example.com' }))
  }),
]
