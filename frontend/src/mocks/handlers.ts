/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from 'msw';

export const handlers = [
  // Coerce resolver to `any` to avoid type incompatibilities with bundled msw types.
  http.get('/api/v1/me', ((_req: any, res: any, ctx: any) => {
    return res(ctx.status(200), ctx.json({ id: 1, email: 'test@example.com' }));
  }) as any),
];
