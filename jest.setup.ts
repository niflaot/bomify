import { TextDecoder, TextEncoder } from 'node:util'

import '@testing-library/jest-dom'

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder
}

if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = jest.fn(() => 'blob:mock-url')
}

if (typeof URL.revokeObjectURL !== 'function') {
  URL.revokeObjectURL = jest.fn()
}

if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = jest.fn(() => false)
}

if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = jest.fn()
}

if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = jest.fn()
}

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = jest.fn()
}

// jsdom dispatches focus/blur events synchronously and re-entrantly (real
// browsers queue them), so two nested Radix FocusScopes (e.g. a Select
// opening inside a Dialog) can ping-pong focus() calls into each other
// forever and blow the stack. Guard against re-entrant focus() calls to
// break that cycle; a normal, non-nested focus() call is unaffected.
let isFocusing = false
const nativeFocus = HTMLElement.prototype.focus

HTMLElement.prototype.focus = function focus(
  this: HTMLElement,
  ...args: Parameters<typeof nativeFocus>
): void {
  if (isFocusing) {
    return
  }

  isFocusing = true

  try {
    nativeFocus.apply(this, args)
  } finally {
    isFocusing = false
  }
}

// Radix Dialog sets `pointer-events: none` on <body> while a modal is open
// and only reverts it via its own unmount effect. If a test leaves a modal
// open (or the previous test's tree is torn down mid-animation), that style
// can leak into the next test and block every pointer interaction there —
// reset it before each test runs, regardless of how the previous one ended.
beforeEach(() => {
  document.body.style.pointerEvents = ''
  document.documentElement.style.pointerEvents = ''
})

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  redirect: jest.fn(),
  useRouter: () => ({
    refresh: jest.fn()
  })
}))
