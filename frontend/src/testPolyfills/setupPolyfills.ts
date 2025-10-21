// Minimal TypeScript test polyfills to run in Jest
/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof (globalThis as any).TransformStream === 'undefined') {
  // Minimal passthrough using Node streams.PassThrough
  const { PassThrough } = require('stream') as typeof import('stream')
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
  const { TextEncoder, TextDecoder } = require('util') as typeof import('util')
  ;(globalThis as any).TextEncoder = TextEncoder
  ;(globalThis as any).TextDecoder = TextDecoder
}

try {
  require('whatwg-fetch')
} catch (e) {
  // ignore if already present
}
