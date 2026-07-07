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
  readonly decreaseZoom: () => void
  readonly handlePointerCancel: (event: PointerEvent<HTMLElement>) => void
  readonly handlePointerDown: (event: PointerEvent<HTMLElement>) => void
  readonly handlePointerMove: (event: PointerEvent<HTMLElement>) => void
  readonly handlePointerUp: (event: PointerEvent<HTMLElement>) => void
  readonly handleWheel: (event: WheelEvent<HTMLElement>) => void
  readonly increaseZoom: () => void
  readonly resetZoom: () => void
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

/**
 * Manages bounded zoom controls for the despiece workspace.
 *
 * @param defaultZoom - Initial zoom in pixels per millimeter.
 * @returns Zoom value and pointer/wheel handlers.
 */
export function useDespieceZoom(defaultZoom: number): DespieceZoomState {
  const [zoom, setZoom] = useState(defaultZoom)
  const pointersRef = useRef(new Map<number, ZoomPoint>())
  const pinchRef = useRef<PinchState | null>(null)

  const resetZoom = useCallback((): void => {
    setZoom(defaultZoom)
  }, [defaultZoom])

  const increaseZoom = useCallback((): void => {
    setZoom(current => clampZoom(current + zoomStep))
  }, [])

  const decreaseZoom = useCallback((): void => {
    setZoom(current => clampZoom(current - zoomStep))
  }, [])

  const handleWheel = useCallback((event: WheelEvent<HTMLElement>): void => {
    if (!event.ctrlKey && !event.metaKey) {
      return
    }

    event.preventDefault()
    setZoom(current => clampZoom(current * (event.deltaY > 0 ? 0.92 : 1.08)))
  }, [])

  const handlePointerDown = useCallback((event: PointerEvent<HTMLElement>): void => {
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
    decreaseZoom,
    handlePointerCancel: endPointer,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: endPointer,
    handleWheel,
    increaseZoom,
    resetZoom,
    zoom
  }
}
