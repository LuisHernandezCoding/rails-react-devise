// Minimal TypeScript test polyfills to run in Jest
/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof (globalThis as any).TransformStream === 'undefined') {
  // Minimal passthrough using Node streams.PassThrough
  // use top-level dynamic import to avoid require()
  const { PassThrough } = (await import('stream')) as unknown as typeof import('stream')
  class MinimalTransformStream {
    readable: any
    writable: any
    constructor() {
      this.readable = new PassThrough({ objectMode: true })
      this.writable = new PassThrough({ objectMode: true })
      this.writable.pipe(this.readable)
    }
  }
  ;(globalThis as any).TransformStream = MinimalTransformStream
}

if (typeof (globalThis as any).TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = (await import('util')) as unknown as typeof import('util')
  ;(globalThis as any).TextEncoder = TextEncoder
  ;(globalThis as any).TextDecoder = TextDecoder
}

// ensure fetch polyfill is loaded when needed
try {
  // @ts-expect-error: this package doesn't expose types for direct import in tests
  await import('whatwg-fetch')
} catch {
  // ignore if already present
}
