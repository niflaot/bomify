import type { CSSProperties } from 'react'

import type { DxfGeometry } from '@/core/utils/dxf.utils'

/**
 * Supported source file types for the pattern renderer.
 */
export type PieceRendererSourceType = 'dxf' | 'pdf'

/**
 * Physical dimensions to use when the source cannot be measured reliably.
 */
export type PieceRendererMeasurements = {
  readonly widthMm: number
  readonly heightMm: number
}

/**
 * User-facing copy used by the renderer.
 */
export type PieceRendererLabels = {
  readonly loading: string
  readonly openPdf: string
  readonly width: string
  readonly height: string
  readonly fallbackError: string
}

/**
 * Props for rendering one pattern piece from a local file or stored asset path.
 */
export type PieceRendererProps = {
  readonly source: string | File
  readonly sourceType?: PieceRendererSourceType
  readonly measurements?: PieceRendererMeasurements
  readonly unitScale?: number
  readonly framed?: boolean
  readonly showMeasurements?: boolean
  readonly strokeWidth?: number
  readonly strokeColor?: string
  readonly hoverStrokeWidth?: number
  readonly hoverStrokeColor?: string
  readonly hoverEnabled?: boolean
  readonly labels?: Partial<PieceRendererLabels>
  readonly className?: string
  readonly style?: CSSProperties
  readonly ariaLabel?: string
}

/**
 * Loading state produced after reading and parsing a piece source.
 */
export type PieceRendererState =
  | {
      readonly status: 'loading'
      readonly key: string
    }
  | {
      readonly status: 'error'
      readonly key: string
      readonly message: string
    }
  | {
      readonly status: 'ready'
      readonly key: string
      readonly sourceUrl: string
      readonly sourceType: PieceRendererSourceType
      readonly dxfGeometry?: DxfGeometry
      readonly pdfBuffer?: ArrayBuffer
      readonly measurements?: PieceRendererMeasurements
    }
