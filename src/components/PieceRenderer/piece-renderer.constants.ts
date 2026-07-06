import type { PieceRendererLabels } from './piece-renderer.types'

export const pdfPointToMm = 25.4 / 72

export const defaultLabels: PieceRendererLabels = {
  loading: 'Loading piece...',
  openPdf: 'Open PDF',
  width: 'Width',
  height: 'Height',
  fallbackError: 'Could not render piece'
}
