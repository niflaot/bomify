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

type ReadyPieceSourceState = Omit<Extract<PieceRendererState, { status: 'ready' }>, 'key'>

const sourceCache = new Map<string, Promise<ReadyPieceSourceState>>()

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
    const cacheable = typeof source === 'string'
    const sourceUrl = sourceType === 'pdf' && !cacheable ? getSourceUrl(source) : ''

    async function load(): Promise<void> {
      try {
        const readyState = await getReadySource({
          cacheable,
          cacheKey: loadKey,
          measurements,
          source,
          sourceType,
          sourceUrl,
          unitScale
        })

        if (!isMounted) {
          return
        }

        setState({ ...readyState, key: loadKey })
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

      if (!cacheable && source instanceof File && sourceUrl && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(sourceUrl)
      }
    }
  }, [fallbackError, loadKey, measurements, source, sourceType, unitScale])

  return useMemo(
    () => state.key === loadKey ? state : { status: 'loading', key: loadKey },
    [loadKey, state]
  )
}

type GetReadySourceOptions = {
  readonly cacheable: boolean
  readonly cacheKey: string
  readonly source: string | File
  readonly sourceType: PieceRendererSourceType
  readonly sourceUrl: string
  readonly measurements?: PieceRendererMeasurements
  readonly unitScale: number
}

function getReadySource(options: GetReadySourceOptions): Promise<ReadyPieceSourceState> {
  if (!options.cacheable) {
    return loadReadySource(options)
  }

  const cached = sourceCache.get(options.cacheKey)

  if (cached) {
    return cached
  }

  const promise = loadReadySource({
    ...options,
    sourceUrl: options.sourceType === 'pdf' ? options.source.toString() : ''
  })

  sourceCache.set(options.cacheKey, promise)

  return promise
}

async function loadReadySource(options: GetReadySourceOptions): Promise<ReadyPieceSourceState> {
  const { measurements, source, sourceType, sourceUrl, unitScale } = options

  if (sourceType === 'dxf') {
    const geometry = parseDxfGeometry(await readSourceText(source))

    return {
      status: 'ready',
      sourceUrl,
      sourceType,
      dxfGeometry: geometry,
      measurements: measurements || {
        widthMm: geometry.bounds.width * unitScale,
        heightMm: geometry.bounds.height * unitScale
      }
    }
  }

  const buffer = await readSourceBuffer(source)

  return {
    status: 'ready',
    sourceUrl,
    sourceType,
    pdfBuffer: buffer,
    measurements: measurements || parsePdfMeasurements(buffer)
  }
}
