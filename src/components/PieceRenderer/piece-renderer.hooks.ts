import { useEffect, useMemo, useState } from 'react'

import { parseDxfGeometry } from '@/core/utils/dxf.utils'

import {
  getSourceKey,
  getSourceUrl,
  inferSourceType,
  parsePdfMeasurements,
  readSourceBuffer,
  readSourceText
} from './piece-renderer.source'
import type {
  PieceRendererMeasurements,
  PieceRendererSourceType,
  PieceRendererState
} from './piece-renderer.types'

type UsePieceSourceProps = {
  readonly source: string | File
  readonly explicitSourceType?: PieceRendererSourceType
  readonly measurements?: PieceRendererMeasurements
  readonly unitScale: number
  readonly fallbackError: string
}

/**
 * Loads a piece source and returns render-ready geometry or PDF data.
 *
 * @param props - Source loading options.
 * @returns Current piece loading state.
 */
export function usePieceSource(props: UsePieceSourceProps): PieceRendererState {
  const {
    explicitSourceType,
    fallbackError,
    measurements,
    source,
    unitScale
  } = props
  const [state, setState] = useState<PieceRendererState>({ status: 'loading', key: '' })
  const sourceType = useMemo(
    () => inferSourceType(source, explicitSourceType),
    [explicitSourceType, source]
  )
  const loadKey = useMemo(
    () => getSourceKey(source, sourceType, unitScale, measurements),
    [measurements, source, sourceType, unitScale]
  )

  useEffect(() => {
    let isMounted = true
    const sourceUrl = sourceType === 'pdf' ? getSourceUrl(source) : ''

    async function load(): Promise<void> {
      try {
        if (sourceType === 'dxf') {
          const text = await readSourceText(source)
          const geometry = parseDxfGeometry(text)

          if (!isMounted) {
            return
          }

          setState({
            status: 'ready',
            key: loadKey,
            sourceUrl,
            sourceType,
            dxfGeometry: geometry,
            measurements: measurements || {
              widthMm: geometry.bounds.width * unitScale,
              heightMm: geometry.bounds.height * unitScale
            }
          })
          return
        }

        const buffer = await readSourceBuffer(source)

        if (!isMounted) {
          return
        }

        setState({
          status: 'ready',
          key: loadKey,
          sourceUrl,
          sourceType,
          pdfBuffer: buffer,
          measurements: measurements || parsePdfMeasurements(buffer)
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        setState({
          status: 'error',
          key: loadKey,
          message: error instanceof Error ? error.message : fallbackError
        })
      }
    }

    void load()

    return () => {
      isMounted = false

      if (source instanceof File && sourceUrl && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(sourceUrl)
      }
    }
  }, [fallbackError, loadKey, measurements, source, sourceType, unitScale])

  return useMemo(
    () => state.key === loadKey ? state : { status: 'loading', key: loadKey },
    [loadKey, state]
  )
}
