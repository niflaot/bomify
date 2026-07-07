import type { PointerEvent, WheelEvent } from 'react'
import { useCallback, useRef, useState } from 'react'

type ZoomPoint = {
  readonly x: number
  readonly y: number
}

type PinchState = {
  readonly distance: number
  readonly zoom: number
}

/**
 * Handlers and values used by the despiece zoom workspace.
 */
export type DespieceZoomState = {
  readonly centerView: () => void
  readonly decreaseZoom: () => void
  readonly handlePointerCancel: (event: PointerEvent<HTMLElement>) => void
  readonly handlePointerDown: (event: PointerEvent<HTMLElement>) => void
  readonly handlePointerMove: (event: PointerEvent<HTMLElement>) => void
  readonly handlePointerUp: (event: PointerEvent<HTMLElement>) => void
  readonly handleWheel: (event: WheelEvent<HTMLElement>) => void
  readonly increaseZoom: () => void
  readonly resetZoom: () => void
  readonly resetZoomAndCenter: () => void
  readonly setViewportElement: (element: HTMLDivElement | null) => void
  readonly zoom: number
}

const minZoom = 0.2
const maxZoom = 1.5
const zoomStep = 0.12

function clampZoom(value: number): number {
  return Math.min(maxZoom, Math.max(minZoom, value))
}

function getDistance(left: ZoomPoint, right: ZoomPoint): number {
  return Math.hypot(left.x - right.x, left.y - right.y)
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element
    && Boolean(target.closest(
      'button, a, input, textarea, [role="button"], [role="combobox"], [data-radix-select-trigger]'
    ))
}

/**
 * Detects pointer events that bubbled from a React portal (e.g. an open
 * Select or Dialog). Portaled content lives outside the viewport in the real
 * DOM, but React still bubbles its events through the component tree, so
 * `currentTarget` receives them even though it never contains `target`.
 */
function isFromPortal(currentTarget: EventTarget & Element, target: EventTarget | null): boolean {
  return target instanceof Node && !currentTarget.contains(target)
}

/**
 * Manages bounded zoom controls for the despiece workspace.
 *
 * @param defaultZoom - Initial zoom in pixels per millimeter.
 * @returns Zoom value and pointer/wheel handlers.
 */
export function useDespieceZoom(defaultZoom: number): DespieceZoomState {
  const [zoom, setZoom] = useState(defaultZoom)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const pointersRef = useRef(new Map<number, ZoomPoint>())
  const pinchRef = useRef<PinchState | null>(null)

  const setViewportElement = useCallback((element: HTMLDivElement | null): void => {
    viewportRef.current = element
  }, [])

  const centerView = useCallback((): void => {
    globalThis.requestAnimationFrame(() => {
      const viewport = viewportRef.current

      if (!viewport) {
        return
      }

      viewport.scrollTo({
        left: Math.max((viewport.scrollWidth - viewport.clientWidth) / 2, 0),
        top: Math.max((viewport.scrollHeight - viewport.clientHeight) / 2, 0)
      })
    })
  }, [])

  const resetZoom = useCallback((): void => {
    setZoom(defaultZoom)
  }, [defaultZoom])

  const resetZoomAndCenter = useCallback((): void => {
    setZoom(defaultZoom)
    globalThis.requestAnimationFrame(() => {
      centerView()
    })
  }, [centerView, defaultZoom])

  const increaseZoom = useCallback((): void => {
    setZoom(current => clampZoom(current + zoomStep))
  }, [])

  const decreaseZoom = useCallback((): void => {
    setZoom(current => clampZoom(current - zoomStep))
  }, [])

  const handleWheel = useCallback((event: WheelEvent<HTMLElement>): void => {
    if ((!event.ctrlKey && !event.metaKey) || isFromPortal(event.currentTarget, event.target)) {
      return
    }

    event.preventDefault()
    setZoom(current => clampZoom(current * (event.deltaY > 0 ? 0.92 : 1.08)))
  }, [])

  const handlePointerDown = useCallback((event: PointerEvent<HTMLElement>): void => {
    if (isInteractiveTarget(event.target) || isFromPortal(event.currentTarget, event.target)) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    })

    if (pointersRef.current.size === 2) {
      const [left, right] = Array.from(pointersRef.current.values())

      pinchRef.current = {
        distance: getDistance(left, right),
        zoom
      }
    }
  }, [zoom])

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>): void => {
    if (isInteractiveTarget(event.target) || isFromPortal(event.currentTarget, event.target)) {
      return
    }

    if (!pointersRef.current.has(event.pointerId)) {
      return
    }

    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    })

    if (pointersRef.current.size !== 2) {
      return
    }

    event.preventDefault()

    const [left, right] = Array.from(pointersRef.current.values())
    const pinch = pinchRef.current

    if (!pinch) {
      pinchRef.current = {
        distance: getDistance(left, right),
        zoom
      }
      return
    }

    setZoom(clampZoom(pinch.zoom * (getDistance(left, right) / pinch.distance)))
  }, [zoom])

  const endPointer = useCallback((event: PointerEvent<HTMLElement>): void => {
    pointersRef.current.delete(event.pointerId)
    pinchRef.current = null
  }, [])

  return {
    centerView,
    decreaseZoom,
    handlePointerCancel: endPointer,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: endPointer,
    handleWheel,
    increaseZoom,
    resetZoom,
    resetZoomAndCenter,
    setViewportElement,
    zoom
  }
}
