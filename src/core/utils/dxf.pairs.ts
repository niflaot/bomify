import type { DxfPair } from './dxf.types'

/**
 * Converts DXF text into group code/value pairs.
 *
 * @param source - DXF text content.
 * @returns Parsed group pairs.
 */
export function toDxfPairs(source: string): DxfPair[] {
  const lines = source.replace(/\r/g, '').split('\n')
  const pairs: DxfPair[] = []

  for (let index = 0; index < lines.length - 1; index += 2) {
    const code = Number(lines[index].trim())
    const value = lines[index + 1].trim()

    if (Number.isFinite(code)) {
      pairs.push({ code, value })
    }
  }

  return pairs
}

/**
 * Reads a numeric DXF pair value with a fallback.
 *
 * @param pair - Optional DXF pair.
 * @param fallback - Value used when the pair is missing or invalid.
 * @returns Numeric value.
 */
export function numberValue(pair: DxfPair | undefined, fallback = 0): number {
  const value = Number(pair?.value)

  return Number.isFinite(value) ? value : fallback
}
