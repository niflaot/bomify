import { pdfPointToMm } from './piece-renderer.constants'
import type {
  PieceRendererMeasurements,
  PieceRendererSourceType
} from './piece-renderer.types'

/**
 * Infers the source type from a file path or browser file.
 *
 * @param source - Source path or local file.
 * @param explicit - Optional caller-provided source type.
 * @returns The resolved source type.
 */
export function inferSourceType(
  source: string | File,
  explicit?: PieceRendererSourceType
): PieceRendererSourceType {
  if (explicit) {
    return explicit
  }

  const name = typeof source === 'string' ? source : source.name

  return name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'dxf'
}

/**
 * Reads a source as text from a path or browser file.
 *
 * @param source - Source path or local file.
 * @returns Source text.
 */
export async function readSourceText(source: string | File): Promise<string> {
  if (source instanceof File) {
    return readFileText(source)
  }

  const response = await fetch(source)

  if (!response.ok) {
    throw new Error(`Could not load ${source}`)
  }

  return response.text()
}

/**
 * Reads a source as binary data from a path or browser file.
 *
 * @param source - Source path or local file.
 * @returns Source buffer.
 */
export async function readSourceBuffer(source: string | File): Promise<ArrayBuffer> {
  if (source instanceof File) {
    return readFileBuffer(source)
  }

  const response = await fetch(source)

  if (!response.ok) {
    throw new Error(`Could not load ${source}`)
  }

  return response.arrayBuffer()
}

/**
 * Creates a stable browser URL for a source.
 *
 * @param source - Source path or local file.
 * @returns Source URL.
 */
export function getSourceUrl(source: string | File): string {
  if (typeof source === 'string') {
    return source
  }

  if (typeof URL.createObjectURL !== 'function') {
    return ''
  }

  return URL.createObjectURL(source)
}

/**
 * Parses physical PDF page dimensions from a MediaBox.
 *
 * @param buffer - PDF binary data.
 * @returns Page dimensions in millimeters when available.
 */
export function parsePdfMeasurements(buffer: ArrayBuffer): PieceRendererMeasurements | undefined {
  const text = new TextDecoder('latin1').decode(buffer)
  const mediaBox = text.match(/\/MediaBox\s*\[\s*[-\d.]+\s+[-\d.]+\s+([-\d.]+)\s+([-\d.]+)\s*\]/)

  if (!mediaBox) {
    return undefined
  }

  const widthPt = Number(mediaBox[1])
  const heightPt = Number(mediaBox[2])

  if (!Number.isFinite(widthPt) || !Number.isFinite(heightPt)) {
    return undefined
  }

  return {
    widthMm: widthPt * pdfPointToMm,
    heightMm: heightPt * pdfPointToMm
  }
}

/**
 * Builds a key that identifies the loaded source and measurement settings.
 *
 * @param source - Source path or local file.
 * @param sourceType - Resolved source type.
 * @param unitScale - Conversion scale from source units to millimeters.
 * @param measurements - Optional measurement override.
 * @returns Stable load key.
 */
export function getSourceKey(
  source: string | File,
  sourceType: PieceRendererSourceType,
  unitScale: number,
  measurements: PieceRendererMeasurements | undefined
): string {
  const sourceId = typeof source === 'string'
    ? source
    : `${source.name}:${source.size}:${source.lastModified}`
  const measuredId = measurements
    ? `${measurements.widthMm}:${measurements.heightMm}`
    : 'auto'

  return `${sourceType}:${sourceId}:${unitScale}:${measuredId}`
}

function readFileText(file: File): Promise<string> {
  if (typeof file.text === 'function') {
    return file.text()
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('error', () => {
      reject(new Error('Could not read local file'))
    })
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Could not read local file'))
    })
    reader.readAsText(file)
  })
}

function readFileBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') {
    return file.arrayBuffer()
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('error', () => {
      reject(new Error('Could not read local file'))
    })
    reader.addEventListener('load', () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result)
        return
      }

      reject(new Error('Could not read local file'))
    })
    reader.readAsArrayBuffer(file)
  })
}
