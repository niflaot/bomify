/**
 * Converts a `#rrggbb` hex color into an RGB triplet for jsPDF fill/draw
 * color calls.
 *
 * @param hex - Hex color, with or without a leading `#`.
 * @returns The `[red, green, blue]` components, each in the 0-255 range.
 */
export function hexToRgb(hex: string): readonly [number, number, number] {
  const normalized = hex.replace('#', '')
  const value = Number.parseInt(normalized, 16)

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}
